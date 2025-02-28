import React, { useEffect, useState } from 'react';
import styles from '../styles/StarRatingInput.module.scss';

interface StarRatingInputProps {
    onSubmit: (rating: number | null) => void;
    onDelete: () => void;
    initialRating?: number | null; // начальное значение
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ onSubmit, onDelete, initialRating }) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(initialRating || null);

    useEffect(() => {
        // Обновляем состояние при изменении начального рейтинга
        setSelectedRating(initialRating || null);
    }, [initialRating]);

    const handleMouseEnter = (value: number) => setHoveredRating(value);

    const handleMouseLeave = () => setHoveredRating(null);

    const handleClick = (value: number) => {
        setSelectedRating(value);
        onSubmit(value);
    };

    const handleReset = () => {
        setSelectedRating(null);
        onDelete();
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <div
                    key={i}
                    className={`${styles.star} ${
                        hoveredRating !== null
                            ? i <= hoveredRating
                                ? styles.filled
                                : ''
                            : i <= (selectedRating || 0)
                            ? styles.filled
                            : ''
                    }`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(i)}
                >
                    ★
                </div>
            );
        }
        return stars;
    };

    return (
        <div>
            <div className={styles.starRating}>{renderStars()}</div>
            {selectedRating !== null && (
                <button onClick={handleReset} className={styles.resetButton}>
                    Сбросить оценку
                </button>
            )}
        </div>
    );
};

export default StarRatingInput;
