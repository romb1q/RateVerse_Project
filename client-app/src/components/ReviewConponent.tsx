import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/ReviewComponent.module.scss';
import { getUserId, getUserRole } from '../utils/fetchUserRole';

interface Review {
  ReviewID: number;
  ReviewUserID: number;
  ReviewContentID: number;
  ReviewText: string;
  ReviewDate: string;
  ReviewStatus: string;
  UserName?: string;
  ReviewRating: number | null;
}

interface ReviewComponentProps {
  userId: string | null;
  contentId?: string;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ userId, contentId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  //const [userRatings, setUserRatings] = useState<{ userId: number; rating: number | null }[]>([]);
  const API_URL = 'http://localhost:5000/api/review';

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
      } catch (error) {
        console.error('Ошибка получения ID пользователя:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const userRole = await getUserRole();
      setRole(userRole || 'guest');
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
        
        const reviewsResponse = await axios.get<Review[]>(
          `${API_URL}/content/${contentId}`, 
          { headers }
        );
  
        const reviewsWithUserNames = await Promise.all(
          reviewsResponse.data.map(async (review) => {
            try {
              const userResponse = await axios.get(
                `http://localhost:5000/api/review/${review.ReviewID}/user`
              );
              return {
                ...review,
                UserName: userResponse.data.userName || 'Неизвестный пользователь',
              };
            } catch {
              return { ...review, UserName: 'Неизвестный пользователь' };
            }
          })
        );
  
        setReviews(reviewsWithUserNames);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (contentId) {
      fetchData();
    }
  }, [contentId]);
  

  

  const addReview = async () => {
    if (!newReviewText.trim()) return;
  
    try {
      const response = await axios.post(API_URL, {
        userId,
        contentId,
        text: newReviewText,
        rating: newRating,
      });
  
      const userResponse = await axios.get(
        `http://localhost:5000/api/review/${response.data.ReviewID}/user`
      );
  
      const newReviewWithUser = {
        ...response.data,
        UserName: userResponse.data.userName || 'Неизвестный пользователь',
      };
  
      setReviews((prev) => [...prev, newReviewWithUser]);
      setNewReviewText('');
      setNewRating(0);
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error);
    }
  };
  

  const deleteReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
      await axios.delete(`${API_URL}/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setReviews((prev) => prev.filter((review) => review.ReviewID !== reviewId));
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
    }
  };

  const updateReview = async (reviewId: number, newText: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
      const response = await axios.put(`${API_URL}/${reviewId}`, 
        {text: newText},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
        );
      setReviews((prev) =>
        prev.map((review) =>
          review.ReviewID === reviewId ? { ...review, ReviewText: response.data.ReviewText } : review
        )
      );
    } catch (error) {
      console.error('Ошибка при обновлении отзыва:', error);
    }
  };

  const blockReview = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
      await axios.patch(`${API_URL}/${reviewId}/status/block`, { status: 'blocked' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews((prev) =>
        prev.map((review) =>
          review.ReviewID === reviewId ? { ...review, ReviewStatus: 'blocked' } : review
        )
      );
    } catch (error) {
      console.error('Ошибка при блокировке отзыва:', error);
    }
  };

  const unblockReviewStatus = async (reviewId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Токен не найден');
        return;
      }
      await axios.patch(`${API_URL}/${reviewId}/status/unblock`, { status: 'available' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews((prev) =>
        prev.map((review) =>
          review.ReviewID === reviewId ? { ...review, ReviewStatus: 'available' } : review
        )
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса отзыва:', error);
    }
  };
  
  console.log('Имя', reviews.map((review) => {return (review.UserName)}));
  

  return (
    <div className={styles.reviewContainer}>
      <h2 className={styles.header}>Отзывы</h2>

      {userId === '0' || userId === null ? (
        <></>
      ) : (
        <div className={styles.addReview}>
          <h3>Добавить отзыв</h3>
          <textarea
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            placeholder="Напишите ваш отзыв"
            rows={3}
            className={styles.textarea}
          />
          
          <button
            onClick={addReview}
            disabled={!newReviewText.trim()}
            className={styles.addButton}
          >
            Добавить
          </button>
        </div>
      )}

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <>
          {reviews.length === 0 ? (
            <p className={styles.noReviews}>Отзывов пока нет</p>
          ) : (
            <ul className={styles.reviewList}>
              {reviews.map((review) => (
                <li key={review.ReviewID} className={styles.reviewItem}>
                  <p className={styles.reviewUserName}>
                    <strong>{review.UserName || 'Неизвестный пользователь'}</strong>
                  </p>
                  <p className={styles.reviewText}>{review.ReviewText}</p>
                  <small className={styles.reviewMeta}>
                    Дата: {new Date(review.ReviewDate).toLocaleDateString()}
                  </small>

                  {role === 'admin' && (
                    <p className={styles.reviewStatus}>
                      Статус: {review.ReviewStatus === 'available' ? 'Доступен' : 'Заблокирован'}
                    </p>
                  )}

                  {review.ReviewUserID === currentUserId && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteReview(review.ReviewID)}
                      >
                        Удалить
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          const newText = prompt('Введите новый текст отзыва', review.ReviewText);
                          if (newText && newText.trim()) {
                            updateReview(review.ReviewID, newText);
                          }
                        }}
                      >
                        Редактировать
                      </button>
                    </div>
                  )}

                  {role === 'admin' && (
                    <div className={styles.adminActions}>
                      {review.ReviewStatus === 'available' ? (
                        <button
                          className={styles.blockButton}
                          onClick={() => blockReview(review.ReviewID)}
                        >
                          Заблокировать
                        </button>
                      ) : (
                        <button
                          className={styles.unblockButton}
                          onClick={() => unblockReviewStatus(review.ReviewID)}
                        >
                          Разблокировать
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}

            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewComponent;
