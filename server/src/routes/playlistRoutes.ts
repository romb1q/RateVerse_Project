import { Router } from 'express';
import PlaylistController from '../controllers/playlistController';


const router = Router();

router.get('/playlists', PlaylistController.getAllPlaylists);

router.get('/playlists/:playlistID/content', PlaylistController.getPlaylistContent);

router.post('/playlists', PlaylistController.createPlaylist);

router.delete('/playlists/:playlistID', PlaylistController.deletePlaylist);

router.post('/playlists/content/:playlistID/:contentID', PlaylistController.addContentToPlaylist);

router.delete('/playlists/content/:playlistID/:contentID', PlaylistController.removeContentFromPlaylist);

router.put('/playlists/:playlistID', PlaylistController.updatePlaylist);


router.get('/playlists/collections', PlaylistController.getCollections);


export default router;
