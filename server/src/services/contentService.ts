import fs from 'fs';
import path from 'path';
import Content, { ContentAttributes } from '../models/Content';

/**
 * @param id Идентификатор контента.
 * @param imageBuffer Буфер изображения.
 * @returns URL изображения.
 */
export const saveImage = (id: number, imageBuffer: Buffer): string => {
  const imagesDir = path.join(__dirname, '../../public/images');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const filePath = path.join(imagesDir, `${id}.jpg`);
  fs.writeFileSync(filePath, imageBuffer);
  return `/images/${id}.jpg`;
};

/**
 * @param ContentModel Модель Sequelize.
 */
export const getAllContents = async (
  ContentModel: any
): Promise<Partial<ContentAttributes>[]> => {
  const contents = await ContentModel.findAll();

  return contents.map((content: ContentAttributes) => ({
    ContentID: content.ContentID,
    ContentType: content.ContentType,
    ContentName: content.ContentName,
    ContentImage: content.ContentImage ? `/${content.ContentID}.jpg` : null,
    ContentDescription: content.ContentDescription,
    ContentDate: content.ContentDate,
    ContentGenre: content.ContentGenre,
  }));
};

/**
 * @param id ID контента
 * @returns Контент или null, если не найден
 */
export const getContentById = async (id: number) => {
  try {
    return await Content.findByPk(id);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    throw new Error('Database query failed');
  }
};