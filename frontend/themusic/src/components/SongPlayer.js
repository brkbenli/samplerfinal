import React, { useEffect } from 'react';

const SongPlayer = ({ song }) => {
    useEffect(() => {
        if (song && song.file_url) {
            const audioElement = document.getElementById('audio-player');
            audioElement.load(); // Force the audio element to load the new source
        }
    }, [song]);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: song ? '350px' : '0',
                height: song ? '80px' : '0',
                transition: 'width 0.3s, height 0.3s',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {song ? (
                <audio id="audio-player" controls autoPlay style={{ width: '300px' }}>
                    <source src={song.file_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default SongPlayer;