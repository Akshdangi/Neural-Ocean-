"""Otolith age prediction service using Random Forest regression."""
import os
import logging
import time
import numpy as np
from datetime import datetime

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "otolith_model.pkl")


class OtolithModelService:
    """Random Forest model for predicting fish age from otolith morphometrics."""

    def __init__(self):
        self.model = None
        self.status = "untrained"
        self.metrics = {}
        self.last_trained = None
        self.error = None
        self.feature_names = ['length', 'width', 'aspect_ratio', 'circularity', 'perimeter', 'weight']

    def train(self):
        """Train Random Forest on synthetic otolith data."""
        self.status = "training"
        self.error = None
        start_time = time.time()

        try:
            from sklearn.ensemble import RandomForestRegressor
            from sklearn.model_selection import train_test_split
            from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
            import joblib
            from data.generators import generate_otolith_data

            logger.info("Generating synthetic otolith data...")
            df = generate_otolith_data(n_samples=1000)

            X = df[self.feature_names].values
            y = df['age'].values

            # Split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )

            logger.info("Training Random Forest model...")
            self.model = RandomForestRegressor(
                n_estimators=200,
                max_depth=15,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X_train, y_train)

            # Evaluate
            y_pred_train = self.model.predict(X_train)
            y_pred_test = self.model.predict(X_test)

            train_r2 = r2_score(y_train, y_pred_train)
            test_r2 = r2_score(y_test, y_pred_test)
            test_mae = mean_absolute_error(y_test, y_pred_test)
            test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))

            # Feature importance
            importances = self.model.feature_importances_
            feature_importance = {
                name: round(float(imp), 4)
                for name, imp in zip(self.feature_names, importances)
            }

            self.metrics = {
                "train_r2": round(float(train_r2), 4),
                "test_r2": round(float(test_r2), 4),
                "test_mae": round(float(test_mae), 4),
                "test_rmse": round(float(test_rmse), 4),
                "n_estimators": 200,
                "training_samples": len(X_train),
                "test_samples": len(X_test),
                "feature_importance": feature_importance
            }

            # Save model
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            joblib.dump(self.model, MODEL_PATH)

            self.status = "ready"
            self.last_trained = datetime.now().isoformat()
            training_time = time.time() - start_time
            self.metrics["training_time_seconds"] = round(training_time, 2)

            logger.info(f"Otolith model trained. R²: {test_r2:.4f}, MAE: {test_mae:.4f}, Time: {training_time:.1f}s")
            return self.metrics

        except Exception as e:
            self.status = "error"
            self.error = str(e)
            logger.error(f"Otolith model training failed: {e}")
            raise

    def predict(self, length: float, width: float, aspect_ratio: float = None,
                circularity: float = None, perimeter: float = None, weight: float = None):
        """Predict fish age from otolith measurements."""
        if self.status != "ready" or self.model is None:
            raise ValueError("Model not trained. Please train the model first.")

        # Compute derived features if not provided
        if aspect_ratio is None:
            aspect_ratio = length / max(width, 0.01)
        if perimeter is None:
            perimeter = 2 * np.pi * np.sqrt((length**2 + width**2) / 2)
        if circularity is None:
            circularity = (4 * np.pi * length * width) / max(perimeter**2, 0.01)
        if weight is None:
            weight = 0.01 + 0.005 * (length * 1.5)

        features = np.array([[length, width, aspect_ratio, circularity, perimeter, weight]])
        prediction = self.model.predict(features)[0]

        # Get prediction from individual trees for confidence interval
        tree_predictions = np.array([tree.predict(features)[0] for tree in self.model.estimators_])
        std = np.std(tree_predictions)
        ci_lower = prediction - 1.96 * std
        ci_upper = prediction + 1.96 * std

        # Feature importance
        importances = self.model.feature_importances_
        feature_importance = {
            name: round(float(imp), 4)
            for name, imp in zip(self.feature_names, importances)
        }

        return {
            "predicted_age": round(float(max(prediction, 0)), 2),
            "confidence_interval": [round(float(max(ci_lower, 0)), 2), round(float(ci_upper), 2)],
            "feature_importance": feature_importance,
            "model_metrics": self.metrics
        }

    def load_model(self):
        """Load a previously saved model from disk."""
        try:
            if os.path.exists(MODEL_PATH):
                import joblib
                self.model = joblib.load(MODEL_PATH)
                self.status = "ready"
                self.last_trained = datetime.fromtimestamp(
                    os.path.getmtime(MODEL_PATH)
                ).isoformat()
                logger.info("Otolith model loaded from disk.")
                return True
        except Exception as e:
            logger.warning(f"Failed to load otolith model: {e}")
        return False

    def get_status(self):
        """Return current model status."""
        return {
            "name": "Otolith Age Prediction (Random Forest)",
            "status": self.status,
            "metrics": self.metrics,
            "last_trained": self.last_trained,
            "error": self.error
        }
