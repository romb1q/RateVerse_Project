import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/PlaylistsComponent.module.scss";
import Header from "./Header";
import Footer from "./Footer";
import PlaylistCard from "./PlaylistCard";
import { Link, useNavigate } from "react-router-dom";

interface Playlist {
  id: number;
  name: string;
  description: string;
  createdDate: string;
  content: number[];
}

interface Content {
  id: number;
  title: string;
}

const PlaylistsComponent: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [allContent, setAllContent] = useState<Content[]>([]);
  //const [searchQuery, setSearchQuery] = useState<string>("");
  //const [sort, setSort] = useState<"alphabetical" | "createdDate">("alphabetical");
  //const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  //const [contentSearchQuery, setContentSearchQuery] = useState<string>("");
  const [contentToAdd, setContentToAdd] = useState<number[]>([]);
  const [contentToRemove, setContentToRemove] = useState<number[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
    fetchAllContent();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/playlists/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const playlistsData = response.data.map((playlist: any) => ({
        id: playlist.PlaylistID,
        name: playlist.PlaylistName,
        description: playlist.PlaylistDescription || "Нет описания",
        createdDate: playlist.PlaylistDate || "Неизвестно",
        content: playlist.contents || [],
      }));

      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Ошибка при загрузке плейлистов:", error);
    }
  };

  const fetchAllContent = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setAllContent(response.data.map((content: any) => ({ id: content.ContentID, title: content.ContentName })));
    } catch (error) {
      console.error("Ошибка при загрузке контента:", error);
    }
  };

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value || "");
  // };

  // const handleSortChange = (type: "alphabetical" | "createdDate") => {
  //   if (sort === type) {
  //     setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //   } else {
  //     setSort(type);
  //     setSortDirection("asc");
  //   }
  // };

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist({ ...playlist });
    // Сбросить изменения контента при редактировании
    setContentToAdd([]);
    setContentToRemove([]);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот плейлист?")) {
      try {
        await axios.delete(`http://localhost:5000/api/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        fetchPlaylists();
      } catch (error) {
        console.error("Ошибка при удалении плейлиста:", error);
      }
    }
  };

  // const handleContentChange = (contentId: number, checked: boolean) => {
  //   if (checked) {
  //     if (editingPlaylist?.content.includes(contentId)) {
  //       // Если контент уже добавлен, не добавляем его повторно и выводим сообщение
  //       console.warn("Контент уже добавлен в плейлист.");
  //       alert("Этот контент уже добавлен в плейлист.");
  //       return; // Не продолжаем выполнение функции
  //     }
  
  //     // Если галочка установлена, добавляем ID в contentToAdd
  //     setContentToAdd((prev) => [...prev, contentId]);
  //     setContentToRemove((prev) => prev.filter((id) => id !== contentId)); // Убираем из удаления
  
  //     // Обновляем массив контента в редактируемом плейлисте
  //     setEditingPlaylist((prev) => ({
  //       ...prev!,
  //       content: [...prev!.content, contentId], // Добавляем контент в массив
  //     }));
  //   } else {
  //     // Если галочка снята, добавляем ID в contentToRemove
  //     setContentToRemove((prev) => [...prev, contentId]);
  //     setContentToAdd((prev) => prev.filter((id) => id !== contentId)); // Убираем из добавления
  
  //     // Обновляем массив контента в редактируемом плейлисте
  //     setEditingPlaylist((prev) => ({
  //       ...prev!,
  //       content: prev!.content.filter((id) => id !== contentId), // Удаляем контент из массива
  //     }));
  //   }
  // };
  
  

  const handleUpdatePlaylist = async () => {
    if (!editingPlaylist) return;
  
    try {
      await axios.put(
        `http://localhost:5000/api/playlists/${editingPlaylist.id}`,
        {
          name: editingPlaylist.name,
          description: editingPlaylist.description,
          contentToAdd, // Отправляем контент для добавления
          contentToRemove, // Отправляем контент для удаления
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      // Обновляем список плейлистов и сбрасываем состояние
      fetchPlaylists();
      setEditingPlaylist(null);
      alert("Плейлист обновлен успешно!");
    } catch (error) {
      console.error("Ошибка при обновлении плейлиста:", error);
      alert("Произошла ошибка при обновлении плейлиста. Попробуйте еще раз.");
    }
  };
  

  // const filteredContent = allContent.filter((content) =>
  //   content.title.toLowerCase().includes(contentSearchQuery.toLowerCase())
  // );

  return (
    <div className={styles.playlistsPage}>
      <Header />

      {/* Контролы для поиска и сортировки
      <div className={styles.controls}>
        {/* Поиск
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по плейлистам..."
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Сортировка
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton}>
            Сортировка: {sort} {sortDirection === "asc" ? "↑" : "↓"}
          </button>
          <ul className={styles.dropdownMenu}>
            <li onClick={() => handleSortChange("alphabetical")}>По алфавиту</li>
            <li onClick={() => handleSortChange("createdDate")}>По дате создания</li>
          </ul>
        </div>
      </div> */}

      <h2 className={styles.title}>Ваши плейлисты</h2>
      
      {/* Сетка с плейлистами и кнопка создания нового плейлиста */}
      <div className={styles.playlistsGrid}>
        <Link to="/playlists/creation">
          <div className={styles.createBlock}>
            <div className={styles.leftBar}></div>
            <div className={styles.content}>
              <h3 className={styles.unTitle}>Создайте плейлист</h3>
            </div>
            <div className={styles.rightBar}></div>
          </div>
        </Link>

        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            name={playlist.name}
            description={playlist.description}
            onClick={() => navigate(`/playlists/${playlist.id}/content`)}
            onEdit={() => handleEdit(playlist)}
            onDelete={() => handleDelete(playlist.id)}
          />
        ))}
      </div>

      {/* Модальное окно для редактирования плейлиста */}
      {editingPlaylist && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Редактировать плейлист</h3>

            {/* Поля для редактирования названия и описания */}
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Название"
                value={editingPlaylist.name}
                onChange={(e) =>
                  setEditingPlaylist({ ...editingPlaylist, name: e.target.value })
                }
              />
              <textarea
                className={styles.modalTextarea}
                placeholder="Описание"
                value={editingPlaylist.description}
                onChange={(e) =>
                  setEditingPlaylist({
                    ...editingPlaylist,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>


            {/* Кнопки для сохранения и отмены */}
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleUpdatePlaylist}>
                Сохранить
              </button>
              <button className={styles.cancelButton} onClick={() => setEditingPlaylist(null)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlaylistsComponent;
