import '../styles/components/message-speaker.styles.scss';

import React, { useState, useRef } from "react";
import { Message } from '../lib/Message';

interface Props {
    message: Message
}

export const MessageSpeaker: React.FC<Props> = ({ message }) => {
    
    function isMainCharacterSpeaking() {
        return message.speaker.toLowerCase().includes("blue cherry")
    }
    
    return (
        <div className={`message-speaker
                            ${isMainCharacterSpeaking() ? 'message-speaker--maincharacter' : ''}
        `}>
            <h2 className="message-speaker--text">
                {message.speaker}
            </h2>
        </div>
      
    )
  }


