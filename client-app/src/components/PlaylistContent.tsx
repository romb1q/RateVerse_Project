import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/PlaylistContent.scss';
import Header from './Header';
import Footer from './Footer';

// Интерфейс для контента
interface Content {
  ContentID: string;
  ContentName: string;
  ContentDescription?: string;
  ContentImage?: string;
  ContentCrew?: string;
  ContentDate?: string;
}

const PlaylistContent: React.FC = () => {
  const { playlistID } = useParams<{ playlistID: string }>();
  const [contentList, setContentList] = useState<Content[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('Untitled Playlist');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  //const [selectedContent, setSelectedContent] = useState<Content[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

    const fetchPlaylistContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/playlists/${playlistID}/content`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const fetchedData = response.data;
        if (fetchedData && Array.isArray(fetchedData.contents)) {
          const transformedContents = fetchedData.contents.map((item: { contentDetails: Content }) => item.contentDetails);
          setContentList(transformedContents);
          setPlaylistName(fetchedData.PlaylistName || 'Untitled Playlist');
        } else {
          setContentList([]);
        }
      } catch (err) {
        console.error('Ошибка при загрузке контента плейлиста:', err);
        setError('Ошибка при загрузке контента плейлиста.');
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchPlaylistContent();
  }, [playlistID]);

  // Функция поиска контента
  const searchContent = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get<Content[]>('http://localhost:5000/api/contents', {
        params: { query },
      });
      setSearchResults(
        response.data.filter((item) =>
          item.ContentName.toLowerCase().includes(query.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Ошибка при поиске контента:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление контента в плейлист
  const addContentToPlaylist = async (content: Content) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Вы не авторизованы!');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/playlists/content/${playlistID}/${content.ContentID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContentList([...contentList, content]);
      alert(`Контент "${content.ContentName}" добавлен в плейлист!`);
      fetchPlaylistContent();
    } catch (error) {
      console.error('Ошибка при добавлении контента в плейлист:', error);
      alert('Ошибка при добавлении контента в плейлист.');
    }
  };

  // Обработчик ввода текста в поисковую строку
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      searchContent(query);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  // Функция удаления контента из плейлиста
  const removeContentFromPlaylist = async (contentID: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Вы не авторизованы!');
        return;
      }

      await axios.delete(`http://localhost:5000/api/playlists/content/${playlistID}/${contentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setContentList(contentList.filter((content) => content.ContentID !== contentID));
      alert('Контент удален из плейлиста.');
    } catch (error) {
      console.error('Ошибка при удалении контента из плейлиста:', error);
      alert('Ошибка при удалении контента из плейлиста.');
    }
  };

  // Блокировка скролла при открытии выпадающего списка
  useEffect(() => {
    if (isDropdownVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Сброс стиля при размонтировании компонента
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDropdownVisible]);

  if (loading) return <div className="playlist-content__loading">Загрузка...</div>;
  if (error) return <div className="playlist-content__error">{error}</div>;

  return (
    <div className="playlist-content">
      <Header />
      <div className="underHeader">
        <button className="backButton" onClick={handleBack}>
          Назад
        </button>
      </div>
      <header className="playlist-content__header">
        <h1 className="playlist-content__title">{playlistName}</h1>
      </header>

      {/* Поиск контента */}
      <div className="search">
        <p>Добавление контента в плейлист:</p>
        <input
          type="text"
          placeholder="Поиск контента"
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // Задержка для обработки кликов
        />
        {isDropdownVisible && (
          <ul className="dropdown">
            {isLoading ? (
              <li>Загрузка...</li>
            ) : searchResults.length === 0 ? (
              <li>Ничего не найдено.</li>
            ) : (
              searchResults.map((content) => (
                <li key={content.ContentID} onClick={() => addContentToPlaylist(content)}>
                  
                  <div>
                    <p>{content.ContentName}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Контент плейлиста */}
      <div className="playlist-content__list">
        {contentList.map((content) => (
          <div key={content.ContentID} className="content-card" onClick={() => navigate(`/content/${content.ContentID}`)}>
            <img
              src={content.ContentImage || '/default-image.png'}
              alt={content.ContentName}
              className="content-card__image"
            />
            <div className="content-card__info">
              <h2 className="content-card__name">{content.ContentName}</h2>
              <p className="content-card__description">{content.ContentDescription || 'Описание отсутствует.'}</p>
              <button
                   className="content-card__remove-button"
                   onClick={(e) => {
                     e.stopPropagation();
                     removeContentFromPlaylist(content.ContentID);
                   }}
                 >
                   Удалить
                 </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default PlaylistContent;
