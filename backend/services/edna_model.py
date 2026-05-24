"""eDNA species classification service using k-mer features and Gradient Boosting."""
import os
import logging
import time
import numpy as np
from itertools import product
from datetime import datetime
from collections import Counter

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "edna_model.pkl")


class EDNAModelService:
    """Gradient Boosting classifier for eDNA species classification using k-mer features."""

    def __init__(self):
        self.model = None
        self.species_names = []
        self.status = "untrained"
        self.metrics = {}
        self.last_trained = None
        self.error = None
        self.k = 4  # k-mer size
        self._kmer_vocabulary = self._build_kmer_vocab(4)

    @staticmethod
    def _build_kmer_vocab(k: int):
        """Build sorted vocabulary of all possible k-mers."""
        bases = ['A', 'T', 'C', 'G']
        return sorted([''.join(combo) for combo in product(bases, repeat=k)])

    def _extract_kmer_features(self, sequence: str):
        """Extract k-mer frequency vector from a DNA sequence."""
        sequence = sequence.upper().replace(' ', '').replace('\n', '')
        k = self.k
        kmer_counts = Counter()

        for i in range(len(sequence) - k + 1):
            kmer = sequence[i:i + k]
            if all(base in 'ATCG' for base in kmer):
                kmer_counts[kmer] += 1

        total = sum(kmer_counts.values()) or 1
        features = np.array([kmer_counts.get(kmer, 0) / total for kmer in self._kmer_vocabulary])
        return features

    def train(self):
        """Train eDNA classifier on synthetic sequence data."""
        self.status = "training"
        self.error = None
        start_time = time.time()

        try:
            from sklearn.ensemble import GradientBoostingClassifier
            from sklearn.model_selection import train_test_split
            from sklearn.metrics import accuracy_score, classification_report
            import joblib
            from data.generators import generate_edna_data

            logger.info("Generating synthetic eDNA data...")
            sequences, labels, species_names = generate_edna_data(sequences_per_species=100)
            self.species_names = species_names

            logger.info("Extracting k-mer features...")
            X = np.array([self._extract_kmer_features(seq) for seq in sequences])
            y = np.array(labels)

            # Split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )

            logger.info("Training Gradient Boosting classifier...")
            self.model = GradientBoostingClassifier(
                n_estimators=150,
                max_depth=5,
                learning_rate=0.1,
                random_state=42
            )
            self.model.fit(X_train, y_train)

            # Evaluate
            y_pred_train = self.model.predict(X_train)
            y_pred_test = self.model.predict(X_test)

            train_acc = accuracy_score(y_train, y_pred_train)
            test_acc = accuracy_score(y_test, y_pred_test)

            # Classification report
            report = classification_report(
                y_test, y_pred_test,
                target_names=species_names,
                output_dict=True,
                zero_division=0
            )

            # Per-class metrics
            per_class = {}
            for species in species_names:
                if species in report:
                    per_class[species] = {
                        "precision": round(report[species]['precision'], 4),
                        "recall": round(report[species]['recall'], 4),
                        "f1": round(report[species]['f1-score'], 4),
                    }

            self.metrics = {
                "train_accuracy": round(float(train_acc), 4),
                "test_accuracy": round(float(test_acc), 4),
                "n_estimators": 150,
                "k_mer_size": self.k,
                "feature_dimensions": len(self._kmer_vocabulary),
                "training_samples": len(X_train),
                "test_samples": len(X_test),
                "num_species": len(species_names),
                "per_class_metrics": per_class
            }

            # Save model
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            joblib.dump({
                'model': self.model,
                'species_names': species_names,
            }, MODEL_PATH)

            self.status = "ready"
            self.last_trained = datetime.now().isoformat()
            training_time = time.time() - start_time
            self.metrics["training_time_seconds"] = round(training_time, 2)

            logger.info(f"eDNA model trained. Accuracy: {test_acc:.4f}, Time: {training_time:.1f}s")
            return self.metrics

        except Exception as e:
            self.status = "error"
            self.error = str(e)
            logger.error(f"eDNA model training failed: {e}")
            raise

    def predict(self, sequence: str):
        """Classify a DNA sequence."""
        if self.status != "ready" or self.model is None:
            raise ValueError("Model not trained. Please train the model first.")

        # Extract features
        features = self._extract_kmer_features(sequence).reshape(1, -1)

        # Predict probabilities
        probas = self.model.predict_proba(features)[0]

        # Top predictions
        top_indices = np.argsort(probas)[::-1][:5]
        top_predictions = [
            {"name": self.species_names[i], "confidence": round(float(probas[i]), 4)}
            for i in top_indices
        ]

        # Biodiversity index (Shannon entropy of predictions)
        nonzero = probas[probas > 0]
        biodiversity_index = -np.sum(nonzero * np.log(nonzero))
        max_entropy = np.log(len(self.species_names))
        biodiversity_normalized = biodiversity_index / max_entropy if max_entropy > 0 else 0

        return {
            "species": self.species_names[top_indices[0]],
            "confidence": round(float(probas[top_indices[0]]), 4),
            "top_predictions": top_predictions,
            "biodiversity_index": round(float(biodiversity_normalized), 4),
            "model_metrics": self.metrics
        }

    def load_model(self):
        """Load a previously saved model from disk."""
        try:
            if os.path.exists(MODEL_PATH):
                import joblib
                saved = joblib.load(MODEL_PATH)
                self.model = saved['model']
                self.species_names = saved['species_names']
                self.status = "ready"
                self.last_trained = datetime.fromtimestamp(
                    os.path.getmtime(MODEL_PATH)
                ).isoformat()
                logger.info("eDNA model loaded from disk.")
                return True
        except Exception as e:
            logger.warning(f"Failed to load eDNA model: {e}")
        return False

    def get_status(self):
        """Return current model status."""
        return {
            "name": "eDNA Classification (Gradient Boosting)",
            "status": self.status,
            "metrics": self.metrics,
            "last_trained": self.last_trained,
            "error": self.error
        }
