import { useState, useEffect, useRef } from 'react';

import '../styles/components/jukebox.styles.scss';

interface Props {
  music_path: string
}

export const Jukebox: React.FC<Props> = ({ music_path }) => {
    const audio = useRef<HTMLAudioElement>(null);
    const songTimeDisplay = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [songTime, setSongTime] = useState('0:00');
    const [tryMe, setTryMe] = useState(true);
    const [lastAudio, setLastAudio] = useState<HTMLAudioElement|null>(null);

    //audio setup
    useEffect(() => {
        if (audio.current) {
            // console.log(`Loading audio file: ${music_path}`);
            audio.current.volume = .5;
            audio.current.addEventListener('timeupdate', () => {
                displayAudioDuration();
            });
        }
    }, []); // music_path

    useEffect(() => {
        isActive ? audio.current?.play() : audio.current?.pause();
        
    }, [isActive, tryMe]);
    
    useEffect(() => {
        // if music path changed, or music play toggle changed...
        if (audio.current && isActive) { // if there is a current audio file and it's set to active (toggled ON)
            // if the audio file changed, pause the old one and load the new one
            // (don't reload the same audio file and start from beginning if the user
            // just wanted to pause the audio by clicking toggle button)
            if (audio.current !== lastAudio) {
                audio.current.pause();
                audio.current.load();
            }
            // play the new/existing audio file
            audio.current.play();
        }
    }, [music_path, isActive]);


    const togglePlay = () => {
        setIsActive(!isActive);
        setTryMe(false);
        setLastAudio(audio.current);
    }

    //make the song time pretty and readable
    const calcAudioTime = (audioDuration: number) => {
        const minutes = Math.floor(audioDuration / 60);
        const seconds = Math.floor(audioDuration % 60);
        const editSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${editSeconds}`;
    }

    const displayAudioDuration = () => {
        if (audio.current) {
            setSongTime(calcAudioTime(audio.current.currentTime));
            // if (isActive) {
            //     setSongTime(calcAudioTime(audio.current.currentTime));
            // }
            // if (!audio.current.paused && !audio.current.muted ) {
            //     setSongTime(calcAudioTime(audio.current.currentTime));
            // }
        }
    }

    return(
        <div className="jukebox--wrapper">
            {
               tryMe ?
               (
                <div className='jukebox__click-me'>
                    click for music! <div className="jukebox__click-me--arrow">&#10157;</div>
                </div>
               ) 
               :
               (
                <></>
               )
            }
            
            
            <div className="jukebox">
                <div className={`jukebox__timer
                            ${isActive ? 'jukebox__timer--active' : ''}
                `}>
                    {songTime}
                </div>
                <div className={`jukebox__play-button
                            ${isActive ? 'jukebox__play-button--active' : ''}
                `}
                    ref={songTimeDisplay}
                    onClick={togglePlay}
                >
                    &#9835;
                </div>
            </div>

            <audio src={music_path}
                    ref={audio}
                    preload="metadata"
                    className="jukebox__html"
                    loop
            />
        </div>
    );
}