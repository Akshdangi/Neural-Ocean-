"""Species identification service using MobileNetV2 transfer learning."""
import os
import io
import logging
import time
import numpy as np
from datetime import datetime

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "species_model.keras")


class SpeciesModelService:
    """MobileNetV2 transfer learning model for marine species identification."""

    def __init__(self):
        self.model = None
        self.class_names = []
        self.status = "untrained"
        self.metrics = {}
        self.last_trained = None
        self.error = None

    def train(self, epochs: int = 5, batch_size: int = 16):
        """Train species classification model with synthetic data."""
        self.status = "training"
        self.error = None
        start_time = time.time()

        try:
            # Lazy imports to avoid loading TF at module level
            import tensorflow as tf
            from tensorflow.keras import layers, Model
            from tensorflow.keras.applications import MobileNetV2
            from data.generators import generate_species_data

            logger.info("Generating synthetic species training data...")
            images, labels, class_names = generate_species_data(num_per_class=50, img_size=64)
            self.class_names = class_names
            num_classes = len(class_names)

            # Resize images to MobileNetV2 input size (96x96 minimum for speed)
            images_resized = tf.image.resize(images, (96, 96)).numpy()

            # Split train/val
            split_idx = int(0.8 * len(images_resized))
            x_train, x_val = images_resized[:split_idx], images_resized[split_idx:]
            y_train, y_val = labels[:split_idx], labels[split_idx:]

            # Convert labels to one-hot
            y_train_oh = tf.keras.utils.to_categorical(y_train, num_classes)
            y_val_oh = tf.keras.utils.to_categorical(y_val, num_classes)

            logger.info("Building MobileNetV2 transfer learning model...")
            # Base model (pretrained on ImageNet)
            base_model = MobileNetV2(
                input_shape=(96, 96, 3),
                include_top=False,
                weights='imagenet'
            )
            base_model.trainable = False  # Freeze base layers

            # Custom classification head
            inputs = tf.keras.Input(shape=(96, 96, 3))
            x = base_model(inputs, training=False)
            x = layers.GlobalAveragePooling2D()(x)
            x = layers.Dense(128, activation='relu')(x)
            x = layers.Dropout(0.3)(x)
            outputs = layers.Dense(num_classes, activation='softmax')(x)

            self.model = Model(inputs, outputs)
            self.model.compile(
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )

            logger.info(f"Training for {epochs} epochs...")
            history = self.model.fit(
                x_train, y_train_oh,
                validation_data=(x_val, y_val_oh),
                epochs=epochs,
                batch_size=batch_size,
                verbose=1
            )

            # Extract metrics
            train_acc = float(history.history['accuracy'][-1])
            val_acc = float(history.history['val_accuracy'][-1])
            train_loss = float(history.history['loss'][-1])
            val_loss = float(history.history['val_loss'][-1])

            self.metrics = {
                "train_accuracy": round(train_acc, 4),
                "val_accuracy": round(val_acc, 4),
                "train_loss": round(train_loss, 4),
                "val_loss": round(val_loss, 4),
                "epochs": epochs,
                "num_classes": num_classes,
                "training_samples": len(x_train),
                "history": {
                    "accuracy": [round(v, 4) for v in history.history['accuracy']],
                    "val_accuracy": [round(v, 4) for v in history.history['val_accuracy']],
                    "loss": [round(v, 4) for v in history.history['loss']],
                    "val_loss": [round(v, 4) for v in history.history['val_loss']],
                }
            }

            # Save model
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            self.model.save(MODEL_PATH)

            # Save class names
            import json
            class_names_path = MODEL_PATH.replace('.keras', '_classes.json')
            with open(class_names_path, 'w') as f:
                json.dump(class_names, f)

            self.status = "ready"
            self.last_trained = datetime.now().isoformat()
            training_time = time.time() - start_time
            self.metrics["training_time_seconds"] = round(training_time, 2)

            logger.info(f"Species model trained. Accuracy: {val_acc:.4f}, Time: {training_time:.1f}s")
            return self.metrics

        except Exception as e:
            self.status = "error"
            self.error = str(e)
            logger.error(f"Species model training failed: {e}")
            raise

    def predict(self, image_bytes: bytes):
        """Predict species from image bytes."""
        if self.status != "ready" or self.model is None:
            raise ValueError("Model not trained. Please train the model first.")

        import tensorflow as tf
        from PIL import Image

        # Load and preprocess image
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = img.resize((96, 96))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = self.model.predict(img_array, verbose=0)[0]

        # Get top-5 predictions
        top_indices = np.argsort(predictions)[::-1][:5]
        top_predictions = [
            {"name": self.class_names[i], "confidence": round(float(predictions[i]), 4)}
            for i in top_indices
        ]

        return {
            "name": self.class_names[top_indices[0]],
            "confidence": round(float(predictions[top_indices[0]]), 4),
            "top_predictions": top_predictions,
            "model_metrics": self.metrics
        }

    def load_model(self):
        """Load a previously saved model from disk."""
        try:
            if os.path.exists(MODEL_PATH):
                import tensorflow as tf
                import json

                self.model = tf.keras.models.load_model(MODEL_PATH)
                class_names_path = MODEL_PATH.replace('.keras', '_classes.json')
                if os.path.exists(class_names_path):
                    with open(class_names_path, 'r') as f:
                        self.class_names = json.load(f)
                self.status = "ready"
                self.last_trained = datetime.fromtimestamp(
                    os.path.getmtime(MODEL_PATH)
                ).isoformat()
                logger.info("Species model loaded from disk.")
                return True
        except Exception as e:
            logger.warning(f"Failed to load species model: {e}")
        return False

    def get_status(self):
        """Return current model status."""
        return {
            "name": "Species Identification (MobileNetV2)",
            "status": self.status,
            "metrics": self.metrics,
            "last_trained": self.last_trained,
            "error": self.error
        }
