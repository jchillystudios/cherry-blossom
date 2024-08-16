import React, { useState, useRef, useEffect } from "react";

import '../styles/components/written-text.styles.scss';

import { TYPING_CLICK_SOUNDS } from "./SoundsLoaded";

var CHAR_WRITE_DURATION = 15 // milliseconds between character played to give typed out effect

interface Props {
  text: string,
  onWriteComplete: () => void,
  writtenTextClass?: string
}

export const WrittenText: React.FC<Props> = ({text, onWriteComplete, writtenTextClass}) => {
    const [displayStrIx, setDisplayStrIx] = useState(0)
    
    // draw text characters
    useEffect(() => {
      const interval = setInterval(() => {
        // console.log(displayStrIx)
        if (displayStrIx > text.length - 1) {
          setDisplayStrIx(text.length)
          onWriteComplete()
          clearInterval(interval)
        } else {
          // add another character
          setDisplayStrIx(displayStrIx => displayStrIx + 1);
          
          // play sound now that another character is written
          // let clickN = Math.floor(Math.random() * 3) + 1; // select random message click noise between 1 and 3
          // let audio = new Audio(`sounds/click${clickN}.mp3`);
          let clickN = Math.floor(Math.random() * TYPING_CLICK_SOUNDS.length);
          // console.log(`playing 'click${clickN + 1}.mp3'`);
          // let audio = TYPING_CLICK_SOUNDS[clickN]; //clickN
          // audio.volume = 0.05;
          // audio.play().catch(() => {
          TYPING_CLICK_SOUNDS[clickN].play().catch(() => {
            // do nothing if browser refuses to play (I don't want to see ugly error messages in console)
          });
        }
      },
      CHAR_WRITE_DURATION // set time (milliseconds) between characters to be written
      );
      return () => clearInterval(interval);
    },
    [displayStrIx, text] // list state dependencies (trigger re-render when these have changed)
    );
    
    // when new text provided, reset the displayStrIx
    useEffect(() => {
        setDisplayStrIx(0)
    }, [text]
    )
    
    
    return (
      <p className={`written-text
          ${writtenTextClass ? writtenTextClass : ''}
      `}>
        {text.substring(0, displayStrIx)}
      </p>
    )
  }

