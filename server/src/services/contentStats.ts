import View  from '../models/View';
import Like  from '../models/Like';
import Watchlist  from '../models/Watchlist';

export const getContentStats = async (contentId: number) => {
  const [watchedCount, likeCount, wishlistCount] = await Promise.all([
    View.count({ where: { ViewContentID: contentId } }),
    Like.count({ where: { LikeContentID: contentId } }),
    Watchlist.count({ where: { WatchListContentID: contentId } }),
  ]);

  return {
    watched: watchedCount,
    likes: likeCount,
    wishlist: wishlistCount,
  };
};
