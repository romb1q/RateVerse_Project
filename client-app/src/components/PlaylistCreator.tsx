import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/PlaylistCreator.module.scss";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

// Интерфейс для контента
interface Content {
  ContentID: string;
  ContentName: string;
  ContentDescription: string;
  ContentImage: string;
}

const PlaylistCreator: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);


  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Функция поиска контента
  const searchContent = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get<Content[]>("http://localhost:5000/api/contents", {
        params: { query },
      });

      setSearchResults(
        response.data.filter((item) =>
          item.ContentName.toLowerCase().includes(query.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Ошибка при поиске контента:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление контента в список
  const addContent = (content: Content) => {
    if (!selectedContent.some((item) => item.ContentID === content.ContentID)) {
      setSelectedContent([...selectedContent, content]);
    }
    setIsDropdownVisible(false);
    setSearchQuery("");
  };

  // Удаление контента из списка
  const removeContent = (contentID: string) => {
    setSelectedContent(selectedContent.filter((item) => item.ContentID !== contentID));
  };

  // Создание плейлиста
  const createPlaylist = async () => {
    if (!name.trim()) {
      alert("Введите название плейлиста!");
      return;
    }
  
    try {
      // Извлекаем токен из локального хранилища
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Вы не авторизованы!");
        return;
      }
  
      // Создание плейлиста
      const playlistResponse = await axios.post(
        "http://localhost:5000/api/playlists",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const playlistID = playlistResponse.data.PlaylistID;
  
      // Добавление контента в плейлист
      for (const content of selectedContent) {
        await axios.post(
          `http://localhost:5000/api/playlists/content/${playlistID}/${content.ContentID}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Передаем токен для каждого запроса
            },
          }
        );
      }
  
      alert("Плейлист успешно создан!");
      setName("");
      setDescription("");
      setSelectedContent([]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Ошибка при создании плейлиста:", error);
      alert("Ошибка при создании плейлиста!");
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

  return (
    
    <div className={styles.container}>
        <Header/>
        <button 
        className={styles.backButton}
        onClick={handleBack}
        >
          Назад
        </button>
      <h2 className={styles.hTitle}>Создать плейлист</h2>

      <div className={styles.form}>
        {/* Поле ввода названия */}
        <div className={styles.inputName}>
          <input
          type="text"
          placeholder="Название плейлиста"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>
        

        {/* Поле ввода описания */}
        <textarea
          placeholder="Описание плейлиста"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Поле поиска контента */}
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Поиск контента"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => setIsDropdownVisible(true)}
            onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // Задержка для обработки кликов
          />
          {isDropdownVisible && (
            <ul className={styles.dropdown}>
              {isLoading ? (
                <li>Загрузка...</li>
              ) : searchResults.length === 0 ? (
                <li>Ничего не найдено.</li>
              ) : (
                searchResults.map((content) => (
                  <li
                    key={content.ContentID}
                    onClick={() => addContent(content)}
                    className={styles.dropdownItem}
                  >
                    <img
          src={content.ContentImage ? `http://localhost:5000/uploads/${content.ContentImage}` : '/placeholder.jpg'}
          style={{ width: '50px', height: 'auto' }}
        />
                    <div>
                      <p>{content.ContentName}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Выбранный контент */}
        <div className={styles.selected}>
          <h3>Выбранный контент:</h3>
          <ul>
            {selectedContent.map((content) => (
              <li key={content.ContentID}>
                <div>
                  <span>{content.ContentName}</span>
                <button onClick={() => removeContent(content.ContentID)}>Удалить</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Кнопка для создания плейлиста */}
        <button className={styles.createButton} onClick={createPlaylist}>
          Создать плейлист
        </button>
      </div>
      <Footer/>
    </div>
  );
};

export default PlaylistCreator;
