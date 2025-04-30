import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Activity.module.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ContentType } from '../utils/types';
import { decodeToken } from '../utils/decodeToken';
import { PieChart, Pie, Cell, Legend, Tooltip, TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

type ActivityItem = {
  id: number;
  type: 'like' | 'view' | 'watchlist';
  date: string;
  content: ContentType;
};

const Activity: React.FC = () => {
  const COLORS = ['#5941A9', '#f39c12', '#d9ceff'];
  
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ likes: number; watched: number; watchlist: number; likesByType: { [type: string]: number };} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dataFirst = [
    { name: 'Лайки', value: stats?.likes || 0 },
    { name: 'Просмотрено', value: stats?.watched || 0 },
    { name: 'В желаемом', value: stats?.watchlist || 0 },
  ];

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

    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
  
      const decoded = decodeToken(token);
      const userId = decoded?.userId;
  
      if (!userId) return;
  
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Ошибка при получении статистики:', err);
      }
    };
    fetchStats();
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
        return 'Просмотрено/пройдено';
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

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#010004',
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          <p style={{ margin: 0 }}>{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
  
    return null;
  };

  if (loading) return <p>Загрузка активности...</p>;

  return (
    <div className={styles.activityPage}>
      <Header />
      <div className={styles.feed}>
        <h2>Ваша активность</h2>
        <h3>Общая статистика</h3>
        {stats && (
          <div className={styles.statsBlock}>
            <div className={styles.allStatBlock}>
              <h4>Оставленные отметки</h4>
              <ul className={styles.statsList}>
              <li>Лайков: <strong>{stats.likes}</strong></li>
              <li>Просмотрено/пройдено: <strong>{stats.watched}</strong></li>
              <li>В желаемом: <strong>{stats.watchlist}</strong></li>
            </ul>
            <PieChart width={300} height={300}>
              <Pie
                data={dataFirst}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {dataFirst.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
            </div>
            <div className={styles.typeStatBlock}>
            {stats?.likesByType && (
              <div className={styles.chartContainer}>
                <h4>Лайки по типу контента</h4>
                <ul className={styles.statsList}>
                  <li>Фильмы: <strong>{stats.likesByType["movie"]}</strong></li>
                  <li>Игры: <strong>{stats.likesByType["game"]}</strong></li>
                  <li>Сериалы: <strong>{stats.likesByType["serial"]}</strong></li>
                </ul>
                <PieChart width={300} height={300}>
                  <Pie
                    data={Object.entries(stats.likesByType).map(([type, value]) => ({ name: type, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {Object.entries(stats.likesByType).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </div>
            )}

            </div>
          </div>
        )}
        <h3>Совершённые действия</h3>
        {activity.length === 0 ? (
          <p>Вы пока не совершали никаких действий.</p>
        ) : (
          <>
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
