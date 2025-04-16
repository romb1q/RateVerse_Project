
import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';
import contentRoutes from './routes/contentRoutes';
import ratingRoutes from './routes/ratingRoutes';
import cors from 'cors';
import likeRoutes from './routes/likeRoutes';
import viewRoutes from './routes/viewRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import reviewRoutes from './routes/reviewRoutes';
import playlistRoutes from './routes/playlistRoutes';
import activityRoutes from './routes/activityRoutes';
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/', contentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api', likeRoutes);
app.use('/api', viewRoutes);
app.use('/api', watchlistRoutes);
app.use('/api', reviewRoutes);
app.use('/api', playlistRoutes);
app.use('/api', activityRoutes);

app.use('/uploads/', express.static(path.join(__dirname, '../uploads')));

app.use((req, res, next) => {
  console.log("Полученные cookies:", req.cookies);
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});