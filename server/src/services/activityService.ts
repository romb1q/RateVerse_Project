import Like from '../models/Like';
import View from '../models/View';
import Watchlist from '../models/Watchlist';
import Content from '../models/Content';

export const fetchUserActivity = async (userId: number) => {
  const likes = await Like.findAll({
    where: { LikeUserID: userId },
    include: [{ model: Content, as: 'Content' }],
  });

  const views = await View.findAll({
    where: { ViewUserID: userId },
    include: [{ model: Content, as: 'Content' }],
  });

  const watchlists = await Watchlist.findAll({
    where: { WatchListUserID: userId },
    include: [{ model: Content, as: 'Content' }],
  });

  return {
    likes,
    views,
    watchlists,
  };
};
