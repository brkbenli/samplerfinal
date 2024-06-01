import { useRef, useEffect, useState } from "react";
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeOff } from "react-icons/fa";
import '../pages/home.css'; // Import the CSS file

const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: '#ccc',
    progressColor: '#0178ff',
    cursorColor: 'transparent',
    responsive: true,
    height: 45, // Reduce the height of the waveform
    normalize: true,
    backend: 'WebAudio',
    barWidth: 1,
    barGap: 2,
});

export default function AudioPlayer({ audiofile }) {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);

        const handleReady = () => {
            setVolume(wavesurfer.current.getVolume());
        };

        wavesurfer.current.load(audiofile);
        wavesurfer.current.on('ready', handleReady);

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.un('ready', handleReady);
                wavesurfer.current.destroy();
                wavesurfer.current = null;
            }
        };
    }, [audiofile]);

    const handlePlayPause = () => {
        setPlaying(!playing);
        wavesurfer.current.playPause();
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        wavesurfer.current.setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const handleMute = () => {
        setMuted(!muted);
        wavesurfer.current.setVolume(muted ? volume : 0);
    };

    return (
        <div className="audio-player">
            <div id='waveform' ref={waveformRef} className="waveform"></div>
            <div className='controls'>
                <button className="control-button" onClick={handlePlayPause}>
                    <FontAwesomeIcon icon={playing ? FaPause : FaPlay} />
                </button>
                <button className="control-button" onClick={handleMute}>
                    <FontAwesomeIcon icon={muted ? FaVolumeOff : FaVolumeMute} />
                </button>
                <input
                    type="range"
                    id="volume"
                    name="volume"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
}