import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { BsFillStopFill, BsFillPlayFill } from 'react-icons/bs';
import '../pages/home.css'; // Import the CSS file

export default function AudioWave({ audiofile, songTitle, boxTitle }) {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#34374B",
            progressColor: "#F90",
            url: audiofile,
            dragToSeek: true,
            height: 40,
            hideScrollbar: true,
            normalize: true,
            barGap: 1,
            barHeight: 15,
            barRadius: 20,
            barWidth: 2,
        });

        const handleReady = () => {
            setVolume(wavesurferRef.current.getVolume());
        };

        const handlePlayPause = () => {
            setIsPlaying(wavesurferRef.current.isPlaying());
        };

        wavesurferRef.current.on('ready', handleReady);
        wavesurferRef.current.on('play', handlePlayPause);
        wavesurferRef.current.on('pause', handlePlayPause);

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.un('ready', handleReady);
                wavesurferRef.current.un('play', handlePlayPause);
                wavesurferRef.current.un('pause', handlePlayPause);
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };
    }, [audiofile]);

    const handlePlayPauseButton = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            setIsPlaying(wavesurferRef.current.isPlaying());
        }
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        wavesurferRef.current.setVolume(newVolume);
    };

    return (
        <div className="container">
            <div className="box-title">
                <h2>{boxTitle}</h2>
            </div>
            <div className="sub-container">
                <div className="song-title">
                    <p>{songTitle}</p>
                </div>
                <div className="wavesurfer-controls">
                    <button onClick={handlePlayPauseButton}>
                        {isPlaying ? <BsFillStopFill /> : <BsFillPlayFill />}
                    </button>
                    <input
                        type="range"
                        id="volume"
                        name="volume"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    />
                </div>
                <div ref={waveformRef} className="wavesurfer-container" />
            </div>
        </div>
    );
}