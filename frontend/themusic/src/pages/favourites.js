import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Pagination from '../components/Pagination';
import SongDisplay from '../components/SongDisplay';
import SongPlayer from '../components/SongPlayer';


const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const Favourites = () => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 44;
    const [selectedSong, setSelectedSong] = useState(null)

    const handleSongSelect = (song) => {
        setSelectedSong(song);
    };

    useEffect(() => {
        const fetchFavoriteSongs = async () => {
            try {
                const response = await axios.get('http://localhost:8081/favorite_songs');
                const songsWithBase64Images = response.data.map((song) => {
                    if (song.cover_art && song.cover_art.data) {
                        const base64String = arrayBufferToBase64(song.cover_art.data);
                        return { ...song, cover_art: `data:image/jpeg;base64,${base64String}` };
                    } else {
                        return { ...song, cover_art: '' };
                    }
                });
                setFavoriteSongs(songsWithBase64Images);
            } catch (error) {
                console.error('Error fetching favorite songs:', error);
            }
        };

        fetchFavoriteSongs();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <h1 className='text-white' style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Proxima Nova' }}>
                Your Favorites
            </h1>
            {favoriteSongs.length === 0 ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontFamily: 'Proxima Nova',
                    textAlign: 'center',
                }}>
                    <h2>You Currently Have No Favourites</h2>
                </div>
            ) : (
                <div style={{ display: 'flex', flexGrow: 1 }}>
                    <SongDisplay 
                        onSongSelect={handleSongSelect} 
                        selectedSong={selectedSong} 
                        currentPage={currentPage} 
                        songsPerPage={itemsPerPage} 
                        displayAll={false}
                    />
                    <SongPlayer song={selectedSong} />
                </div>
            )}
            {favoriteSongs.length > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={favoriteSongs.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );}
export default Favourites;