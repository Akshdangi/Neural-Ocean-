"""Synthetic data generators for demo/training purposes."""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import string


MARINE_SPECIES_CLASSES = [
    'Bluefin Tuna', 'Atlantic Cod', 'Clownfish', 'Great White Shark',
    'Blue Whale', 'Sea Turtle', 'Jellyfish', 'Seahorse', 'Manta Ray', 'Dolphin'
]

EDNA_SPECIES = [
    'Thunnus thynnus', 'Gadus morhua', 'Acropora cervicornis',
    'Posidonia oceanica', 'Calanus pacificus', 'Tursiops truncatus',
    'Carcharodon carcharias', 'Chelonia mydas'
]


def generate_species_data(num_per_class: int = 50, img_size: int = 64):
    """
    Generate synthetic image data for species classification.
    Each species gets distinct color/pattern characteristics to make the model learnable.
    """
    images = []
    labels = []

    for class_idx, species in enumerate(MARINE_SPECIES_CLASSES):
        # Each species gets a unique base color profile
        base_r = (class_idx * 25 + 30) % 256
        base_g = (class_idx * 37 + 60) % 256
        base_b = (class_idx * 53 + 90) % 256

        for _ in range(num_per_class):
            # Create image with species-specific patterns
            img = np.zeros((img_size, img_size, 3), dtype=np.uint8)

            # Base color with noise
            img[:, :, 0] = np.clip(base_r + np.random.randint(-30, 30, (img_size, img_size)), 0, 255)
            img[:, :, 1] = np.clip(base_g + np.random.randint(-30, 30, (img_size, img_size)), 0, 255)
            img[:, :, 2] = np.clip(base_b + np.random.randint(-30, 30, (img_size, img_size)), 0, 255)

            # Add species-specific patterns (stripes, spots, gradients)
            pattern_type = class_idx % 4
            if pattern_type == 0:  # Horizontal stripes
                for y in range(0, img_size, 8):
                    img[y:y+4, :, class_idx % 3] = np.clip(
                        img[y:y+4, :, class_idx % 3].astype(int) + 80, 0, 255
                    ).astype(np.uint8)
            elif pattern_type == 1:  # Spots
                for _ in range(5):
                    cx, cy = np.random.randint(10, img_size-10, 2)
                    rr = np.random.randint(3, 8)
                    y_grid, x_grid = np.ogrid[-cy:img_size-cy, -cx:img_size-cx]
                    mask = x_grid**2 + y_grid**2 <= rr**2
                    img[mask, (class_idx + 1) % 3] = np.clip(
                        img[mask, (class_idx + 1) % 3].astype(int) + 100, 0, 255
                    ).astype(np.uint8)
            elif pattern_type == 2:  # Vertical gradient
                gradient = np.linspace(0, 120, img_size).reshape(1, -1).astype(np.uint8)
                gradient = np.broadcast_to(gradient, (img_size, img_size))
                img[:, :, (class_idx + 2) % 3] = np.clip(
                    img[:, :, (class_idx + 2) % 3].astype(int) + gradient, 0, 255
                ).astype(np.uint8)
            else:  # Diagonal pattern
                for i in range(img_size):
                    offset = (i * 2) % img_size
                    img[i, offset:min(offset+6, img_size), class_idx % 3] = np.clip(
                        img[i, offset:min(offset+6, img_size), class_idx % 3].astype(int) + 90, 0, 255
                    ).astype(np.uint8)

            images.append(img)
            labels.append(class_idx)

    images = np.array(images, dtype=np.float32) / 255.0
    labels = np.array(labels)

    # Shuffle
    indices = np.random.permutation(len(images))
    return images[indices], labels[indices], MARINE_SPECIES_CLASSES


def generate_stock_data(years: int = 10, regions: list[str] | None = None):
    """
    Generate synthetic fish stock time series data with realistic patterns.
    Includes seasonal cycles, trends, and environmental variables.
    """
    if regions is None:
        regions = ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean', 'Mediterranean Sea']

    all_data = []
    start_date = datetime(2014, 1, 1)

    for region in regions:
        dates = [start_date + timedelta(days=30 * i) for i in range(years * 12)]

        # Base stock level with trend
        trend = np.linspace(100, 100 + np.random.uniform(-20, 30), len(dates))

        # Seasonal pattern (higher in summer, lower in winter)
        seasonal = 15 * np.sin(2 * np.pi * np.arange(len(dates)) / 12)

        # Random walk noise
        noise = np.cumsum(np.random.normal(0, 2, len(dates)))

        stock_level = trend + seasonal + noise
        stock_level = np.clip(stock_level, 20, 200)

        # Environmental correlates
        sea_temp = 18 + 5 * np.sin(2 * np.pi * np.arange(len(dates)) / 12) + np.random.normal(0, 1, len(dates))
        salinity = 35 + np.random.normal(0, 0.5, len(dates))

        for i, date in enumerate(dates):
            all_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'stock_level': round(float(stock_level[i]), 2),
                'sea_temp': round(float(sea_temp[i]), 2),
                'salinity': round(float(salinity[i]), 2),
                'region': region
            })

    return pd.DataFrame(all_data)


def generate_otolith_data(n_samples: int = 1000):
    """
    Generate synthetic otolith morphometric data with realistic correlations.
    Age correlates with length, width, and weight.
    """
    np.random.seed(42)

    # True age (target variable) — 1 to 25 years
    age = np.random.uniform(1, 25, n_samples)

    # Morphometric features correlated with age
    length = 1.5 + 0.15 * age + np.random.normal(0, 0.3, n_samples)  # mm
    width = 0.5 + 0.06 * age + np.random.normal(0, 0.15, n_samples)   # mm
    weight = 0.01 + 0.005 * age**1.2 + np.random.normal(0, 0.02, n_samples)  # grams

    # Derived features
    aspect_ratio = length / np.clip(width, 0.1, None)
    perimeter = 2 * np.pi * np.sqrt((length**2 + width**2) / 2)
    circularity = (4 * np.pi * length * width) / np.clip(perimeter**2, 0.01, None)

    # Ensure non-negative values
    length = np.clip(length, 0.5, None)
    width = np.clip(width, 0.2, None)
    weight = np.clip(weight, 0.005, None)

    df = pd.DataFrame({
        'length': np.round(length, 3),
        'width': np.round(width, 3),
        'aspect_ratio': np.round(aspect_ratio, 3),
        'circularity': np.round(circularity, 3),
        'perimeter': np.round(perimeter, 3),
        'weight': np.round(weight, 4),
        'age': np.round(age, 1)
    })

    return df


def generate_edna_data(sequences_per_species: int = 100, min_len: int = 150, max_len: int = 300):
    """
    Generate synthetic eDNA sequences for species classification.
    Each species gets distinct nucleotide frequency profiles.
    """
    bases = ['A', 'T', 'C', 'G']
    sequences = []
    labels = []

    # Each species has a distinct nucleotide frequency signature
    species_profiles = {
        'Thunnus thynnus':         [0.30, 0.25, 0.25, 0.20],
        'Gadus morhua':            [0.22, 0.28, 0.30, 0.20],
        'Acropora cervicornis':    [0.35, 0.15, 0.20, 0.30],
        'Posidonia oceanica':      [0.20, 0.30, 0.15, 0.35],
        'Calanus pacificus':       [0.25, 0.25, 0.30, 0.20],
        'Tursiops truncatus':      [0.28, 0.22, 0.22, 0.28],
        'Carcharodon carcharias':  [0.18, 0.32, 0.28, 0.22],
        'Chelonia mydas':          [0.32, 0.18, 0.25, 0.25],
    }

    for species_idx, (species, probs) in enumerate(species_profiles.items()):
        for _ in range(sequences_per_species):
            seq_len = np.random.randint(min_len, max_len + 1)
            # Add some conserved motifs unique to each species
            motif = ''.join(random.choices(bases, weights=probs, k=8))
            seq = ''.join(random.choices(bases, weights=probs, k=seq_len))
            # Insert motif at random positions
            pos = random.randint(0, len(seq) - len(motif))
            seq = seq[:pos] + motif + seq[pos + len(motif):]
            sequences.append(seq)
            labels.append(species_idx)

    # Shuffle
    combined = list(zip(sequences, labels))
    random.shuffle(combined)
    sequences, labels = zip(*combined)

    return list(sequences), list(labels), EDNA_SPECIES
