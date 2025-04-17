// src/App.tsx
import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import Home from '../components/Home';
import MoviesPage from '../components/MoviesPage';
import SerialsPage from '../components/SerialsPage';
import GamesPage from '../components/GamesPage';
//import PrivateRoute from '../components/PrivateRoute';
import ContentPage from "../components/ContentPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from '../components/AdminPanel';
import BlockedPage from '../components/BlockedPage';
import WatchlistPage from '../components/WatchlistPage';
import PlaylistsComponent from '../components/PlaylistsComponent';
import PlaylistCreator from '../components/PlaylistCreator';
import PlaylistContent from '../components/PlaylistContent';
import WelcomeScreen from '../components/WelcomeScreen';
import LikesPage from '../components/LikesPage';
import Activity from '../components/ActivityComponent';
import Recommendations from '../components/RecommendationsComponent';



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<WelcomeScreen/>} />
        <Route path="/register" element={<SignUp/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/blocked" element={<BlockedPage />} />
        <Route path="/home" element={
            //<PrivateRoute>
              <Home />
            //</PrivateRoute>
          }
        />
        
        <Route path='/movies' element={<MoviesPage/>}/>
        <Route path='/serials' element={<SerialsPage/>}/>
        <Route path='/games' element={<GamesPage/>}/>
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/content/:id" element={<ContentPage/>} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/playlists" element={<PlaylistsComponent />} />
        <Route path="/playlists/creation" element={<PlaylistCreator />} />
        <Route path="/playlists/:playlistID/content" element={<PlaylistContent/>} />
        <Route path="/likes" element={<LikesPage/>} />
        <Route path="/activity" element={<Activity/>} />
        <Route path="/recommendations" element={<Recommendations/>} />
      </Routes>
      <ToastContainer style={{background:"red"}} position="top-right" autoClose={3000} hideProgressBar={false} />
    </BrowserRouter>
  );
};

export default App;
