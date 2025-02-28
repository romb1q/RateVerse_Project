import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../styles/MoviesPage.module.scss";
import EditContentForm from './EditContentForm';

interface Content {
  ContentID: number;
  ContentType: string;
  ContentName: string;
  ContentImage?: string;
  ContentDescription?: string;
  ContentDate?: string;
  ContentCrew?: string;
  ContentGenre?: string;
}

const ContentAdminPanel: React.FC = () => {
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [filter, setFilter] = useState({ type: 'All' });
  const [newContent, setNewContent] = useState({
    ContentType: 'movie',
    ContentName: '',
    ContentDescription: '',
    ContentDate: '',
    ContentCrew: '',
    ContentImage: null as File | null,
    ContentGenre: '',
  });
  

  useEffect(() => {
    fetchContentList();
  }, []);

  const fetchContentList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contents');
      setContentList(response.data);
      
    } catch (error) {
      console.error('Error fetching content list:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewContent((prev) => ({ ...prev, ContentImage: e.target.files![0] }));
    }
  };
  

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ContentType', newContent.ContentType);
      formData.append('ContentName', newContent.ContentName);
      formData.append('ContentDescription', newContent.ContentDescription || '');
      formData.append('ContentDate', newContent.ContentDate || '');
      formData.append('ContentGenre', newContent.ContentGenre || '');
      formData.append('ContentCrew', newContent.ContentCrew || '');
      
      if (newContent.ContentImage) {
        formData.append('ContentImage', newContent.ContentImage);
      }
      
  
      await axios.post('http://localhost:5000/api/contents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      fetchContentList();
      setNewContent({
        ContentType: 'movie',
        ContentName: '',
        ContentDescription: '',
        ContentDate: '',
        ContentImage: null,
        ContentGenre: '',
        ContentCrew: '',
      });
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };
  

  const handleDeleteContent = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот контент?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/contents/${id}`);
      alert('Контент успешно удалён');
      fetchContentList();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Не удалось удалить контент');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredContents = contentList
    .filter((newContent) => {
      const matchesType = filter.type === 'All' || newContent.ContentType === filter.type;
      
      return matchesType;
    });

  const openEditForm = (id: number) => setEditingContentId(id);
  const closeEditForm = () => setEditingContentId(null);

  return (
    <div className={styles.contentPanel}>
      <div className="content-list">
        <h2>Content List</h2>
        {editingContentId && (
        <div className="modal">
          <EditContentForm contentId={editingContentId} onClose={closeEditForm} />
        </div>
        )}
        <select
          name="type"
          className={styles.filterSelect}
          value={filter.type}
          onChange={handleFilterChange}
        >
          <option value="All">Все</option>
          <option value="movie">Фильмы</option>
          <option value="serial">Сериалы</option>
          <option value="game">Игры</option>
        </select>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Image</th>
              <th>Description</th>
              <th>Crew</th>
              <th>Genre</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.ContentID}>
                <td>{content.ContentName}</td>
                <td>{content.ContentType}</td>
                <td>
                  <img
                    src={content.ContentImage ? `http://localhost:5000/uploads/${content.ContentImage}` : '/placeholder.jpg'}
                    alt={content.ContentName}
                    style={{ width: '50px', height: 'auto' }}
                  />
                </td>
                <td>{content.ContentDescription}</td>
                <td>{content.ContentCrew}</td>
                <td>{content.ContentGenre}</td>
                <td>{content.ContentDate}</td>
                <td>
                  <button onClick={() => handleDeleteContent(content.ContentID)}>Delete</button>
                </td>
                <td><button onClick={() => openEditForm(content.ContentID)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-content-form">
        <h2>Add New Content</h2>
        <form onSubmit={handleAddContent}>
          <select name="ContentType" value={newContent.ContentType} onChange={handleInputChange} required>
            <option value="movie">movie</option>
            <option value="serial">serial</option>
            <option value="game">game</option>
          </select>
          <input
            type="text"
            name="ContentName"
            placeholder="Content Name"
            value={newContent.ContentName}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="ContentDescription"
            placeholder="Content Description"
            value={newContent.ContentDescription}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="ContentDate"
            value={newContent.ContentDate}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="ContentCrew"
            placeholder="Content Crew"
            value={newContent.ContentCrew}
            onChange={handleInputChange}
            required
          />
          <input type="file" name="ContentImage" accept="image/*" onChange={handleFileChange} />
          <input
            type="text"
            name="ContentGenre"
            value={newContent.ContentGenre}
            onChange={handleInputChange}
          />
          <button type="submit">Add Content</button>
        </form>
      </div>
    </div>
  );
};

export default ContentAdminPanel;
