import React from 'react';
import styles from '../styles/SerialCard.module.scss';

interface SerialCardProps {
  serial: {
    id: number;
    title: string;
    poster: string;
    rating: number;
  };
}

const SerialCard: React.FC<SerialCardProps> = ({ serial }) => {
  return (
    <div className={styles.serialCard}>
      <img src={serial.poster} alt={serial.title} className={styles.poster} />
      <div className={styles.info}>
        <h3 className={styles.title}>{serial.title}</h3>
        <p className={styles.rating}>Рейтинг: {serial.rating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default SerialCard;
