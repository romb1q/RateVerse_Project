import Like  from '../models/Like';
import Content from '../models/Content';
import { Op } from 'sequelize';

const getRecommendationsByUser = async (userId: number) => {
  const likes = await Like.findAll({
    where: { LikeUserID: userId },
    include: [{
      model: Content,
      as: 'Content',
      attributes: ['ContentID', 'ContentType', 'ContentName', 'ContentImage', 'ContentCrew', 'ContentDescription', 'ContentDate','ContentGenre'],
    },],
  });

  const genreMap: { [key: string]: string[] } = {
    movie: [],
    serial: [],
    game: [],
  };

  likes.forEach((like) => {
    const content = like.Content;
    if (!content) return;
    const type = content.ContentType;
    const genre = content.ContentGenre;
    if (genreMap[type] && genre) {
      genreMap[type].push(genre);
    }
  });

  const topGenres = (genres: string[]) => {
    const freq: { [genre: string]: number } = {};
    genres.forEach((g) => (freq[g] = (freq[g] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted.map(([genre]) => genre);
  };

  const topGenresByType = {
    movie: topGenres(genreMap.movie),
    serial: topGenres(genreMap.serial),
    game: topGenres(genreMap.game),
  };

  const getByGenre = async (type: string, genres: string[]) => {
    return Content.findAll({
      where: {
        ContentType: type,
        ContentGenre: { [Op.in]: genres },
      },
      limit: 10,
    });
  };

  return {
    movie: await getByGenre('movie', topGenresByType.movie),
    serial: await getByGenre('serial', topGenresByType.serial),
    game: await getByGenre('game', topGenresByType.game),
  };
};

export default { getRecommendationsByUser };
