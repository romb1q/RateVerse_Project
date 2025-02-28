import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditContentFormProps {
    contentId: number | string;
    onClose: () => void;
  }

const EditContentForm: React.FC<EditContentFormProps> = ({ contentId, onClose }) => {
  const [formData, setFormData] = useState({
    ContentType: '',
    ContentName: '',
    ContentDescription: '',
    ContentDate: '',
    ContentGenre: '',
    ContentCrew: '',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const response = await axios.get(`http://localhost:5000/api/contents/${contentId}`);
      setFormData(response.data);
    };
    fetchContent();
  }, [contentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key as keyof typeof formData] as string);
    }
    if (image) {
      updatedData.append('ContentImage', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/contents/${contentId}`, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onClose();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="ContentName" placeholder="Content Name" value={formData.ContentName} onChange={handleInputChange} />
      <textarea name="ContentDescription" placeholder="Content Description" value={formData.ContentDescription} onChange={handleInputChange} />
      <input type="date" name="ContentDate" placeholder="Content Date" value={formData.ContentDate} onChange={handleInputChange} />
      <input type="text" name="ContentGenre" placeholder="Content Genre" value={formData.ContentGenre} onChange={handleInputChange} />
      <input type="text" name="ContentCrew" placeholder="Content Crew" value={formData.ContentCrew} onChange={handleInputChange} />
      <select name="ContentType" value={formData.ContentType} onChange={handleInputChange}>
        <option value="movie">movie</option>
        <option value="serial">serial</option>
        <option value="game">game</option>
      </select>
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditContentForm;
