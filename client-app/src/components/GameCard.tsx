import React from 'react';
import styles from '../styles/GameCard.module.scss';

interface GameCardProps {
  game: {
    id: number;
    title: string;
    poster: string;
    rating: number;
  };
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className={styles.gameCard}>
      <img src={game.poster} alt={game.title} className={styles.poster} />
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <p className={styles.rating}>Рейтинг: {game.rating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default GameCard;
