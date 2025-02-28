import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log('Обработка файла в multer:', file); // Лог файла
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file) {
      console.error('Файл не передан!');
      cb(null, false); // Продолжаем, но без файла
    } else {
      console.log('Мултер получил файл:', file);
      cb(null, true);
    }
  },
});

export { upload };
