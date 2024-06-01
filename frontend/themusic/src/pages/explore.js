import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import SongDisplay from "../components/SongDisplay";
import SongPlayer from "../components/SongPlayer";
import Pagination from "../components/Pagination";

export default function Explore() {
    const [selectedSong, setSelectedSong] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 44;

    const handleSongSelect = (song) => {
        setSelectedSong(song);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <h1 className="text-white" style={{display: 'flex', justifyContent: 'center', fontFamily: "Proxima Nova"}}>Explore</h1>
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <SongDisplay 
                    onSongSelect={handleSongSelect} 
                    selectedSong={selectedSong} 
                    currentPage={currentPage} 
                    songsPerPage={songsPerPage} 
                    displayAll={true}
                />
                <SongPlayer song={selectedSong} />
            </div>
            <Pagination 
                currentPage={currentPage} 
                totalItems={2005} // Replace with actual total count from your API
                itemsPerPage={songsPerPage} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
}