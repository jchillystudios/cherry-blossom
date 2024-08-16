import React, { useState, useRef } from "react";

import '../styles/components/chat-option.styles.scss';

import { Option } from "../lib/Option"
import { WrittenText } from "./WrittenText";

interface Props {
  option: Option,
  onWriteComplete: () => void,
  onOptionSelected: (option:Option) => void
}

export const ChatOption: React.FC<Props> = ({option, onWriteComplete, onOptionSelected}) => {
    
    function getOptionString() {
      return `${option.id}. ${option.text}`
    }
    
    function handleOptionClicked(click_event: React.MouseEvent<HTMLElement>) {
      // console.log(`Option clicked: ${click_event}`)
      onOptionSelected(option)
    }
    
    return (
      <div className="chat-option" onClick={handleOptionClicked}>
        <WrittenText text={getOptionString()} 
                      onWriteComplete={onWriteComplete} 
                      writtenTextClass="written-text__options"
        />
      </div>
    )
  }

