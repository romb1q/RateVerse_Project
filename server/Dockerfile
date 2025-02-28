# Используем официальное изображение Node.js
FROM node:20

# Задаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Открываем порт 
EXPOSE 5000

# Запускаем команду для запуска приложения
CMD ["npm", "start"]
