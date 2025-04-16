import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Activity.module.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ContentType } from '../utils/types';

type ActivityItem = {
  id: number;
  type: 'like' | 'view' | 'watchlist';
  date: string;
  content: ContentType;
};

const Activity: React.FC = () => {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:5000/api/activity', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const likes = res.data.likes.map((like: any) => ({
          id: like.LikeID,
          type: 'like',
          date: like.LikeDate,
          content: like.Content,
        }));

        const views = res.data.views.map((view: any) => ({
          id: view.ViewID,
          type: 'view',
          date: view.ViewDate,
          content: view.Content,
        }));

        const watchlists = res.data.watchlists.map((wl: any) => ({
          id: wl.WatchlistID,
          type: 'watchlist',
          date: wl.WatchListDate,
          content: wl.Content,
        }));

        const allActivity = [...likes, ...views, ...watchlists].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setActivity(allActivity);
      } catch (err) {
        console.error('Ошибка при получении активности:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const totalPages = Math.ceil(activity.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'like':
        return 'Поставлен лайк';
      case 'view':
        return 'Просмотрено';
      case 'watchlist':
        return 'Добавлено в желаемое';
      default:
        return '';
    }
  };

  const renderPageNumbers = (): JSX.Element => {
    const pageNumbers: JSX.Element[] = [];
    const maxVisiblePages = 6;
  
    const createButton = (
      label: string | number,
      page: number | null,
      isActive: boolean = false,
      isDisabled: boolean = false
    ) => (
      <button
        key={`btn-${label}-${Math.random()}`}
        onClick={() => {
          if (page !== null && !isDisabled) handlePageChange(page);
        }}
        disabled={isDisabled}
        className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
      >
        {label}
      </button>
    );
  
    if (totalPages > 1) {
      pageNumbers.push(createButton('|<', 1, false, currentPage === 1));
      pageNumbers.push(createButton('<', currentPage - 1, false, currentPage === 1));
    }
  
    const pages: (number | string)[] = [];
  
    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const showLeftDots = currentPage > 4;
      const showRightDots = currentPage < totalPages - 3;
  
      pages.push(1); // первая страница
  
      if (showLeftDots) {
        pages.push('...');
      }
  
      const startPage = showLeftDots ? currentPage - 1 : 2;
      const endPage = showRightDots ? currentPage + 1 : totalPages - 1;
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      if (showRightDots) {
        pages.push('...');
      }
  
      pages.push(totalPages); // последняя страница
    }
  
    pages.forEach((page) => {
      if (typeof page === 'string') {
        pageNumbers.push(createButton('...', null, false, true));
      } else {
        pageNumbers.push(createButton(page, page, currentPage === page));
      }
    });
  
    if (totalPages > 1) {
      pageNumbers.push(createButton('>', currentPage + 1, false, currentPage === totalPages));
      pageNumbers.push(createButton('>|', totalPages, false, currentPage === totalPages));
    }
  
    return <div className={styles.pagination}>{pageNumbers}</div>;
  };
  
  
  
  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activity.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <p>Загрузка активности...</p>;

  return (
    <div className={styles.activityPage}>
      <Header />
      <div className={styles.feed}>
        <h2>Ваша активность</h2>
        {activity.length === 0 ? (
          <p>Вы пока не совершали никаких действий.</p>
        ) : (
          <>
            {/* Отрисовываем ТОЛЬКО текущие элементы */}
            <div key={`page-${currentPage}`} className={styles.pageContainer}>
              {currentItems.map((item) => (
                <div key={`${item.type}-${item.id}`} className={styles.feedItem}>
                  <div className={styles.label}>{getLabel(item.type)}</div>
                  <div className={styles.content}>
                    <div className={styles.infoDiv}>
                      <p className={styles.title}>{item.content?.ContentName || 'Без названия'}</p>
                      <span className={styles.date}>
                        {new Date(item.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {renderPageNumbers()}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Activity;
