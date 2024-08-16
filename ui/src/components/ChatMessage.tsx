import React, { useState, useRef, useEffect } from "react";
import '../styles/components/chatMessage.styles.scss';
import { Message } from "../lib/Message"
import { ChatOptions } from "./ChatOptions";
import { WrittenText } from "./WrittenText";
import { Option } from "../lib/Option"
import { MessageSpeaker } from './MessageSpeaker';
import { TextInput } from './TextInput';

// max number of characters player has to type out before they are passed to next message
// const MAX_N_CHARS_BEFORE_PASSING = 30

interface Props {
  message: Message,
  showNextMessageButton: () => void,
  hideNextMessageButton: () => void,
  // onWriteComplete: () => void,
  onOptionSelected: (option:Option) => void
}

export const ChatMessage: React.FC<Props> = ({message, showNextMessageButton, hideNextMessageButton, onOptionSelected}) => {
    const [writeComplete, setWriteComplete] = useState(false)
    // const [textInputText, setTextInputText] = useState("")
    const [nTriesTextInput, setNTriesTextInput] = useState(0)
    
    // plays sound once
    if (message.has_sound()) {
      let audio = new Audio(message.sound_path)
      audio.volume = 0.3
      audio.play()
    }
    
    function onWriteComplete() {
      setWriteComplete(true)
      if ((!message.is_input_required()) && (!message.has_options())) {
        showNextMessageButton()
      }
    }
    
    function cleanMessage(msg: string) {
      return msg.toLowerCase().split(" ").join("")  // .replace(" ", "") only replaces 1st occurrence of space
    }
    
    function onTextInputChange(e: React.FormEvent<HTMLInputElement>) {
      // increment the number of characters user has typed
      // if user has tried too much, just let them pass
      // setNTriesTextInput(nTriesTextInput + 1)
      // if (nTriesTextInput >= MAX_N_CHARS_BEFORE_PASSING) {
      //   showNextMessageButton();
      //   return
      // }
      
      // setTextInputText(e.currentTarget.value)
      // console.log(textInputText)
      // add max tries before passing to next message
      var message_required_cleaned = cleanMessage(message.input_required);
      var message_input_cleaned = cleanMessage(e.currentTarget.value);
      if (e.currentTarget.value !== "") {
        if (message.input_required === "?") {
          // allow any input
          showNextMessageButton()
        } else if (message_input_cleaned === message_required_cleaned) {
          showNextMessageButton()
        } else {
          hideNextMessageButton()
        }
      } else {
        hideNextMessageButton()
      }
    }
    
    return (
      <div className="chat-message">
        {
          message.speaker != "System"
          ?
            <MessageSpeaker message={message}></MessageSpeaker>
          :
            <></>
        }
        <WrittenText text={message.text} onWriteComplete={onWriteComplete}></WrittenText>
        
        {
          message.has_options()
          ?
            <ChatOptions options={message.options} onOptionSelected={onOptionSelected}></ChatOptions>
          :
            <></>
        }
        
        {
          message.is_input_required()
          ?
            <TextInput onChangeHandler={onTextInputChange} />
          :
            <></>
        }
      </div>
    )
  }

