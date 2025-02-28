import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/MovieCard.module.scss';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster: string;
    rating?: number; // Если передается рейтинг, запрос к API можно пропустить
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [averageRating, setAverageRating] = useState<number | null>(movie.rating ?? null);

  // Функция для получения среднего рейтинга
  const fetchAverageRating = async (contentId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ratings/${contentId}`);
      const ratings = response.data;

      if (ratings.length > 0) {
        const totalScore = ratings.reduce((sum: number, rating: { RatingScore: number }) => sum + rating.RatingScore, 0);
        const average = totalScore / ratings.length;
        console.log('Средний рейтинг фильма: ', average);
        setAverageRating(average);

        console.log('Средний рейтинг фильма: ', averageRating);

      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error(`Ошибка при загрузке рейтинга для контента ID ${contentId}:`, error);
      setAverageRating(null);
    }
  };

  // рейтинг при монтировании компонента
  useEffect(() => {
    if (movie.rating === undefined) {
      fetchAverageRating(movie.id);
    }
  }, [movie.id, movie.rating]);

  return (
    <div className={styles.movieCard}>
      <img src={movie.poster} alt={movie.title} className={styles.poster} />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.rating}>
          Рейтинг: {averageRating !== null ? averageRating.toFixed(1) : 'Загрузка...'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
