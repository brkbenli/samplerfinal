import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FaHeartCircleCheck } from 'react-icons/fa6';

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const shuffleArray = (() => {
    let lastShuffleTime = 0;
    let shuffledArray = [];

    return (array) => {
        const currentTime = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // Check if 24 hours have passed since the last shuffle
        if (currentTime - lastShuffleTime >= twentyFourHours || !shuffledArray.length) {
            // Shuffle the array
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            // Update the last shuffle time and shuffled array
            lastShuffleTime = currentTime;
            shuffledArray = [...array];
        }

        return shuffledArray;
    };
})();

const SongDisplay = ({ onSongSelect, selectedSong, currentPage, songsPerPage, displayAll }) => {
    const [allSongs, setAllSongs] = useState([]);
    const [hoveredSongId, setHoveredSongId] = useState(null);
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [currentSongImage, setCurrentSongImage] = useState(null);
    const [currentSongTitle, setCurrentSongTitle] = useState('');

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://localhost:8081/audio_tracks');
                console.log('API Response:', response.data); // Log the API response

                const songsWithBase64Images = response.data.map((song) => {
                    if (song.cover_art && song.cover_art.data) {
                        const base64String = arrayBufferToBase64(song.cover_art.data);
                        console.log('Base64 String for song:', song.name, base64String); // Log the base64 string
                        return { ...song, cover_art: `data:image/jpeg;base64,${base64String}` };
                    } else {
                        console.error('Invalid cover data for song:', song);
                        return { ...song, cover_art: '' }; // Handle missing cover data
                    }
                });
                setAllSongs(shuffleArray(songsWithBase64Images));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchFavoriteSongs = async () => {
            try {
                const response = await axios.get('http://localhost:8081/favorite_songs');
                const favoriteSongs = response.data.reduce((acc, song) => {
                    acc[song.id] = true;
                    return acc;
                }, {});
                setFavoriteStatus(favoriteSongs);
            } catch (error) {
                console.error('Error fetching favorite songs:', error);
            }
        };

        fetchSongs();
        fetchFavoriteSongs();
    }, []);

    useEffect(() => {
        if (selectedSong) {
            setCurrentSongImage(selectedSong.cover_art);
            setCurrentSongTitle(selectedSong.name);
        } else {
            setCurrentSongImage(null);
            setCurrentSongTitle('');
        }
    }, [selectedSong]);

    const startIndex = (currentPage - 1) * songsPerPage;
    let songsToDisplay = displayAll ? allSongs : allSongs.filter(song => favoriteStatus[song.id]);
    // const currentSongs = songsToDisplay.slice(startIndex, startIndex + songsPerPage);

    const handleFavorite = async (songId) => {
        try {
            // If the song is already favorited, unfavorite it
            if (favoriteStatus[songId]) {
                await axios.post('http://localhost:8081/unfavorite', { songId });
                setFavoriteStatus((prevStatus) => ({
                    ...prevStatus,
                    [songId]: false, // Set the favorite status to false
                }));
            } else {
                // Otherwise, favorite the song
                await axios.post('http://localhost:8081/favorite', { songId });
                setFavoriteStatus((prevStatus) => ({
                    ...prevStatus,
                    [songId]: true, // Set the favorite status to true
                }));
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('You must be logged in to favourite songs');
                setTimeout(() => {
                    setErrorMessage(''); // Clear error message after 1 second
                }, 2000);
            } else {
                console.error('Error favoriting/unfavoriting song:', error);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {currentSongImage && (
            <div style={{ position: 'fixed', top: '400px', left: '185px', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '10px', borderRadius: '10px', paddingBottom: '50px', width: '330px', overflow: 'hidden' }}>
                <img src={currentSongImage} alt={currentSongTitle} style={{ width: '330px', height: '330px', borderRadius: '10px',}} />
                <h3 style={{ textAlign: 'center', paddingTop: '20px', color: 'black', fontSize: '22px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSongTitle}</h3>
            </div>
        )}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginLeft: selectedSong ? '370px' : '0',
                transition: 'margin-left 1.5s'
            }}>
                {songsToDisplay.slice(startIndex, startIndex + songsPerPage).map((song) => (
                    <div
                        key={song.id}
                        style={{ width: '150px', margin: '10px', cursor: 'pointer' }}
                        onClick={() => onSongSelect(song)}
                    >
                        {song.cover_art ? (
                            <img src={song.cover_art} alt={song.name} style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '10px'
                            }} />
                        ) : (
                            <div style={{
                                width: '150px',
                                height: '150px',
                                backgroundColor: 'black',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px'
                            }}>
                                No Image
                            </div>
                        )}
                        <h2 style={{
                            fontSize: '16px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '5px',
                            border: '0px solid #ddd',
                            padding: '5px',
                            borderRadius: '5px',
                            color: 'white'
                        }}>
                            {song.name}
                        </h2>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFavorite(song.id);
                            }}
                            onMouseEnter={() => setHoveredSongId(song.id)}
                            onMouseLeave={() => setHoveredSongId(null)}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                        >
                            {favoriteStatus[song.id] ? (
                                <FaHeartCircleCheck className='w-20 h-8' color='white' />
                            ) : hoveredSongId === song.id ? (
                                <FaHeart className='w-20 h-8' color='white' />
                            ) : (
                                <FaRegHeart className='w-20 h-8' color='white' />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {errorMessage && (
                <div style={{
                    position: 'fixed',
                    top: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 1000
                }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SongDisplay;