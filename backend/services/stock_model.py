"""Fish stock prediction service using LSTM neural network."""
import os
import logging
import time
import numpy as np
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "stock_model.keras")
SCALER_PATH = os.path.join(BASE_DIR, "models", "stock_scaler.pkl")


class StockModelService:
    """LSTM model for fish stock level time-series forecasting."""

    def __init__(self):
        self.model = None
        self.scaler = None
        self.status = "untrained"
        self.metrics = {}
        self.last_trained = None
        self.error = None
        self._last_sequence = None
        self._last_dates = None

    def train(self, epochs: int = 30, batch_size: int = 32):
        """Train LSTM model on synthetic stock data."""
        self.status = "training"
        self.error = None
        start_time = time.time()

        try:
            import tensorflow as tf
            from sklearn.preprocessing import MinMaxScaler
            import joblib
            from data.generators import generate_stock_data

            logger.info("Generating synthetic stock data...")
            df = generate_stock_data(years=10)

            # Use first region for training demo
            region_data = df[df['region'] == 'Atlantic Ocean'].copy()
            region_data = region_data.sort_values('date').reset_index(drop=True)

            # Features: stock_level, sea_temp, salinity
            features = region_data[['stock_level', 'sea_temp', 'salinity']].values

            # Normalize
            self.scaler = MinMaxScaler()
            features_scaled = self.scaler.fit_transform(features)

            # Create sliding windows (look_back = 12 months)
            look_back = 12
            X, y = [], []
            for i in range(look_back, len(features_scaled)):
                X.append(features_scaled[i - look_back:i])
                y.append(features_scaled[i, 0])  # Predict stock_level

            X = np.array(X)
            y = np.array(y)

            # Train/val split
            split_idx = int(0.8 * len(X))
            X_train, X_val = X[:split_idx], X[split_idx:]
            y_train, y_val = y[:split_idx], y[split_idx:]

            logger.info("Building LSTM model...")
            self.model = tf.keras.Sequential([
                tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(look_back, 3)),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.LSTM(32),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(16, activation='relu'),
                tf.keras.layers.Dense(1)
            ])

            self.model.compile(
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                loss='mse',
                metrics=['mae']
            )

            logger.info(f"Training LSTM for {epochs} epochs...")
            history = self.model.fit(
                X_train, y_train,
                validation_data=(X_val, y_val),
                epochs=epochs,
                batch_size=batch_size,
                verbose=1
            )

            # Store last sequence for prediction
            self._last_sequence = features_scaled[-look_back:]
            self._last_dates = region_data['date'].iloc[-1]

            # Compute metrics
            train_loss = float(history.history['loss'][-1])
            val_loss = float(history.history['val_loss'][-1])
            train_mae = float(history.history['mae'][-1])
            val_mae = float(history.history['val_mae'][-1])

            self.metrics = {
                "train_loss": round(train_loss, 6),
                "val_loss": round(val_loss, 6),
                "train_mae": round(train_mae, 6),
                "val_mae": round(val_mae, 6),
                "epochs": epochs,
                "look_back_months": look_back,
                "training_samples": len(X_train),
                "history": {
                    "loss": [round(v, 6) for v in history.history['loss']],
                    "val_loss": [round(v, 6) for v in history.history['val_loss']],
                    "mae": [round(v, 6) for v in history.history['mae']],
                    "val_mae": [round(v, 6) for v in history.history['val_mae']],
                }
            }

            # Save model and scaler
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            self.model.save(MODEL_PATH)
            joblib.dump({
                'scaler': self.scaler,
                'last_sequence': self._last_sequence,
                'last_date': self._last_dates
            }, SCALER_PATH)

            self.status = "ready"
            self.last_trained = datetime.now().isoformat()
            training_time = time.time() - start_time
            self.metrics["training_time_seconds"] = round(training_time, 2)

            logger.info(f"Stock model trained. Val MAE: {val_mae:.6f}, Time: {training_time:.1f}s")
            return self.metrics

        except Exception as e:
            self.status = "error"
            self.error = str(e)
            logger.error(f"Stock model training failed: {e}")
            raise

    def predict(self, months_ahead: int = 12, region: str = "Global"):
        """Forecast stock levels for the next N months."""
        if self.status != "ready" or self.model is None:
            raise ValueError("Model not trained. Please train the model first.")

        predictions = []
        current_sequence = self._last_sequence.copy()

        # Parse last date
        if isinstance(self._last_dates, str):
            last_date = datetime.strptime(self._last_dates, '%Y-%m-%d')
        else:
            last_date = self._last_dates

        for i in range(months_ahead):
            # Predict next step
            input_seq = current_sequence.reshape(1, current_sequence.shape[0], current_sequence.shape[1])
            pred_scaled = self.model.predict(input_seq, verbose=0)[0, 0]

            # Inverse transform to get actual value
            dummy_row = np.zeros((1, 3))
            dummy_row[0, 0] = pred_scaled
            pred_value = self.scaler.inverse_transform(dummy_row)[0, 0]

            # Confidence interval (simple approach: ±10% of prediction)
            std = abs(pred_value) * 0.1
            lower = pred_value - 1.96 * std
            upper = pred_value + 1.96 * std

            forecast_date = last_date + timedelta(days=30 * (i + 1))
            predictions.append({
                "date": forecast_date.strftime('%Y-%m-%d'),
                "value": round(float(pred_value), 2),
                "lower_bound": round(float(lower), 2),
                "upper_bound": round(float(upper), 2)
            })

            # Update sequence for next prediction (auto-regressive)
            new_row = np.array([[pred_scaled, current_sequence[-1, 1], current_sequence[-1, 2]]])
            current_sequence = np.vstack([current_sequence[1:], new_row])

        return {
            "forecast": predictions,
            "model_metrics": self.metrics,
            "region": region
        }

    def load_model(self):
        """Load a previously saved model from disk."""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
                import tensorflow as tf
                import joblib

                self.model = tf.keras.models.load_model(MODEL_PATH)
                saved = joblib.load(SCALER_PATH)
                self.scaler = saved['scaler']
                self._last_sequence = saved['last_sequence']
                self._last_dates = saved['last_date']
                self.status = "ready"
                self.last_trained = datetime.fromtimestamp(
                    os.path.getmtime(MODEL_PATH)
                ).isoformat()
                logger.info("Stock model loaded from disk.")
                return True
        except Exception as e:
            logger.warning(f"Failed to load stock model: {e}")
        return False

    def get_status(self):
        """Return current model status."""
        return {
            "name": "Fish Stock Prediction (LSTM)",
            "status": self.status,
            "metrics": self.metrics,
            "last_trained": self.last_trained,
            "error": self.error
        }
