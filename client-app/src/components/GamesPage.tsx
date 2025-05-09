import React, { useEffect, useState } from 'react';
import styles from '../styles/GamesPage.module.scss';
import Header from './Header';
import GameCard from "./GameCard";
import Footer from './Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Game {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  releaseDate: string;
}

interface APIContent {
  ContentID: number;
  ContentType: string;
  ContentName: string;
  ContentImage?: string; 
  ContentDescription?: string;
  ContentDate?: string;
  ContentGenre?: string;
}



const GamesPage: React.FC = () => {
  const [games, setMovies] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState({ genre: 'Все жанры', year: 'Все годы' });
  const [sort, setSort] = useState<'rating' | 'alphabetical' | 'releaseDate'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get<APIContent[]>('http://localhost:5000/api/contents');
      const gameContents = response.data.filter((item) => item.ContentType === 'game');
  
      const gamesData = await Promise.all(
        gameContents.map(async (item) => {
          let rating = 0;
          try {
            const ratingsResponse = await axios.get(`http://localhost:5000/api/ratings/${item.ContentID}`);
            const ratings = ratingsResponse.data;
            if (ratings.length > 0) {
              const totalScore = ratings.reduce(
                (sum: number, rating: { RatingScore: number }) => sum + rating.RatingScore,
                0
              );
              rating = totalScore / ratings.length;
            }
          } catch (error) {
            console.error(`Ошибка при загрузке рейтинга для фильма с ID ${item.ContentID}:`, error);
          }
  
          return {
            id: item.ContentID,
            title: item.ContentName,
            poster: item.ContentImage ? `http://localhost:5000/uploads/${item.ContentImage}` : '/placeholder.jpg',
            rating,
            releaseDate: item.ContentDate || 'Unknown',
            genre: item.ContentGenre || 'Unknown',
          };
        })
      );
  
      setMovies(gamesData);
    } catch (error) {
      console.error('Ошибка при загрузке контента:', error);
    }
  };
  
  
  
  const genreMap = {
    'Все жанры': 'All',
    'Шутер': 'Action',
    'RPG': 'RPG',
    'Головоломка': 'Puzzle',
    'Хоррор': 'Horror',
    'Стратегия': 'Strategy',
  };

  const selectedGenre = genreMap[filter.genre as keyof typeof genreMap];

  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key: 'genre' | 'year', value: string) => {
    setFilter({ ...filter, [key]: value });
  };

  const handleSortChange = (type: 'rating' | 'alphabetical' | 'releaseDate') => {
    if (sort === type) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(type);
      setSortDirection('asc');
    }
  };
  const filteredGames = games
  .filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    //const selectedGenre = genreMap[filter.genre];
    const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;

    const matchesYear =
      filter.year === 'Все годы' ||
      (() => {
        const gameYear = parseInt(game.releaseDate.slice(0, 4), 10);
        if (isNaN(gameYear)) return false;

        const [startYear, endYear] = filter.year.split('-').map(Number);
        return gameYear >= startYear && gameYear <= endYear;
      })();

    return matchesSearch && matchesGenre && matchesYear;
  })
  .sort((a, b) => {
    if (sort === 'rating') return sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    if (sort === 'alphabetical') return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    return sortDirection === 'asc'
      ? new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  return (
    <div className={styles.gamesPage}>
      <Header />

      <div className={styles.controls}>
        {/* Поиск */}
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по играм..."
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Фильтрация жанра */}
        <div className={styles.dropdown}>
    <button className={styles.dropdownButton}>
      {filter.genre}
      <span className={styles.arrow}>
      <svg className={styles.arrSvg} width="11" height="8" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.76583e-07 1.11111C1.50275e-07 0.810186 0.0804038 0.549769 0.241211 0.329862C0.402018 0.109954 0.592448 6.07865e-07 0.8125 5.88628e-07L12.1875 -4.05806e-07C12.4076 -4.25044e-07 12.598 0.109953 12.7588 0.329861C12.9196 0.549768 13 0.810185 13 1.11111C13 1.41204 12.9196 1.67245 12.7588 1.89236L7.07129 9.67014C6.91048 9.89005 6.72005 10 6.5 10C6.27995 10 6.08952 9.89005 5.92871 9.67014L0.241211 1.89236C0.0804039 1.67245 2.02891e-07 1.41204 1.76583e-07 1.11111Z" fill="#FFF8F0"/>
</svg>
      </span>
    </button>
    <ul className={styles.dropdownMenu}>
      {Object.keys(genreMap).map((genreRus) => (
        <li
          key={genreRus}
          className={filter.genre === genreRus ? styles.active : ''}
          onClick={() => handleFilterChange('genre', genreRus)}
        >
          {genreRus}
        </li>
      ))}
    </ul>
  </div>

        <div className={styles.dropdown}>
          <button className={styles.dropdownButton}>
            {filter.year}
            <span className={styles.arrow}>
            <svg className={styles.arrSvg} width="11" height="8" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.76583e-07 1.11111C1.50275e-07 0.810186 0.0804038 0.549769 0.241211 0.329862C0.402018 0.109954 0.592448 6.07865e-07 0.8125 5.88628e-07L12.1875 -4.05806e-07C12.4076 -4.25044e-07 12.598 0.109953 12.7588 0.329861C12.9196 0.549768 13 0.810185 13 1.11111C13 1.41204 12.9196 1.67245 12.7588 1.89236L7.07129 9.67014C6.91048 9.89005 6.72005 10 6.5 10C6.27995 10 6.08952 9.89005 5.92871 9.67014L0.241211 1.89236C0.0804039 1.67245 2.02891e-07 1.41204 1.76583e-07 1.11111Z" fill="#FFF8F0"/>
</svg>
            </span>
          </button>
          <ul className={styles.dropdownMenu}>
            {['Все годы', '1980-1990', '1990-2000', '2000-2010', '2010-2015', '2015-2024'].map((year) => (
              <li key={year} onClick={() => handleFilterChange('year', year)}>
                {year}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton}>
            Сортировка: {sort} {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          <ul className={styles.dropdownMenu}>
            {['rating', 'alphabetical', 'releaseDate'].map((type) => (
              <li key={type} onClick={() => handleSortChange(type as 'rating' | 'alphabetical' | 'releaseDate')}>
                {type === 'rating' && 'По рейтингу'}
                {type === 'alphabetical' && 'По алфавиту'}
                {type === 'releaseDate' && 'По дате выпуска'}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.gamesGrid}>
        {filteredGames.map((game) => (
          <Link to={`/content/${game.id}`} key={game.id}>
          <GameCard key={game.id} game={game} />
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default GamesPage;
