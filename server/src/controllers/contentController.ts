import { Request, Response } from 'express';
import { getContentById, getAllContents } from '../services/contentService';
import Content from '../models/Content';
import fs from 'fs';
import path from 'path';

/**
 * Получение всех данных контента.
 */
export const getAllContentsController = async (req: Request, res: Response) => {
  try {
    const contents = await getAllContents(Content);
    res.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch contents' });
  }
};

/**
 * Получить контент по ID.
 */
export const getContentByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Проверяем, что ID является числом.
  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Некорректный ID контента' });
    return;
  }

  try {
    const content = await getContentById(Number(id));

    if (!content) {
      res.status(404).json({ error: 'Контент не найден' });
      return;
    }

    res.json(content);
  } catch (error) {
    console.error('Ошибка в контроллере getContentById:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении контента' });
  }
};

/**
 * Создание нового контента.
 */
export const createContentController = async (req: Request, res: Response) => {
  try {
    const { ContentType, ContentName, ContentDescription, ContentDate, ContentGenre, ContentCrew } = req.body;

    // Создаём запись в базе данных
    const newContent = await Content.create({
      ContentType,
      ContentName,
      ContentImage: null, // Сначала пустое значение
      ContentDescription: ContentDescription || '',
      ContentDate: ContentDate || null,
      ContentGenre: ContentGenre || '',
      ContentCrew: ContentCrew || '',
    });

    const contentId = newContent.ContentID; // Получаем ID созданной записи
    console.log('Созданный Content ID:', contentId);

    console.log('Тело запроса:', req.body);
    console.log('Файл запроса:', req.file);
    // Проверяем, загружен ли файл
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname); // Получаем расширение файла
      const newFileName = `${contentId}${fileExtension}`; // Имя файла = ID + расширение
      const oldPath = path.join('uploads', req.file.filename); // Временный файл
      const newPath = path.join('uploads', newFileName); // Новый путь

      console.log('Старый путь:', oldPath);
      console.log('Новый путь:', newPath);

      // Переименовываем файл
      fs.renameSync(oldPath, newPath);

      // Обновляем запись в базе данных с путём к изображению
      newContent.ContentImage = `${req.protocol}://${req.get('host')}/uploads/${newFileName}`;
      await newContent.save();

      console.log('Изображение успешно сохранено:', newContent.ContentImage);
    } else {
      console.warn('Файл изображения не был передан');
    }

    res.status(201).json(newContent);
  } catch (error) {
    console.error('Ошибка при добавлении контента:', error);
    res.status(500).json({ error: 'Failed to add content' });
  }
};

/**
 * Удаление контента по ID.
 */
export const deleteContentController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Проверка корректности ID
  if (isNaN(Number(id))) {
    res.status(400).json({ error: 'Invalid Content ID' });
    return;
  }

  try {
    const content = await Content.findByPk(id);
    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    // Удаляем изображение, если оно существует
    if (content.ContentImage) {
      const imagePath = path.join(__dirname, '../uploads', content.ContentImage);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (fileError) {
        console.error('Error deleting image file:', fileError);
        // Не блокируем основной процесс удаления
      }
    }

    // Удаляем запись из базы данных
    try {
      await content.destroy();
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (dbError) {
      console.error('Error destroying content record:', dbError);
      res.status(500).json({ error: 'Failed to delete content from database' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
};

export const updateContentController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { ContentType, ContentName, ContentDescription, ContentDate, ContentGenre, ContentCrew } = req.body;

  try {
    // Найти существующий контент
    const content = await Content.findByPk(id);
    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    // Обновление данных
    content.ContentType = ContentType || content.ContentType;
    content.ContentName = ContentName || content.ContentName;
    content.ContentDescription = ContentDescription || content.ContentDescription;
    content.ContentDate = ContentDate || content.ContentDate;
    content.ContentGenre = ContentGenre || content.ContentGenre;
    content.ContentCrew = ContentCrew || content.ContentCrew;

    // Обновление изображения
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${id}${fileExtension}`;
      const oldPath = path.join('uploads', req.file.filename);
      const newPath = path.join('uploads', newFileName);

      // Удалить старое изображение, если оно есть
      if (content.ContentImage) {
        const oldImagePath = path.join('uploads', path.basename(content.ContentImage));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      fs.renameSync(oldPath, newPath);
      content.ContentImage = `${req.protocol}://${req.get('host')}/uploads/${newFileName}`;
    }

    await content.save();
    res.status(200).json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
};

