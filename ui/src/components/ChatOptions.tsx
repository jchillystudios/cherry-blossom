import React, { useState, useRef } from "react";
import { ChatOption } from "./ChatOption"
import { Option } from "../lib/Option"

interface Props {
  options: Array<Option>,
  onOptionSelected: (option:Option) => void
}

export const ChatOptions: React.FC<Props> = ({options, onOptionSelected}) => {
    
    function onWriteComplete() {
      
    }
    
    return (
      <div className="chat-option">
        {
          options.map(function(o, ix) {
            return <ChatOption key={o.id} option={o} onWriteComplete={onWriteComplete} onOptionSelected={onOptionSelected}></ChatOption>
          })
        }
      </div>
    )
  }

