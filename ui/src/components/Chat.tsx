import React, { useState, useRef, useEffect, useImperativeHandle } from "react";

import '../styles/components/chat.styles.scss';

import { EventPlayer } from "../lib/EventPlayer";
import { Option } from "../lib/Option";
import { ChatMessage } from "./ChatMessage";
import { NextMessageButton } from "./NextMessageButton";

var MESSAGE_DURATION = 500 // milliseconds

interface Props {
  event_player: EventPlayer,
  forceUpdate: () => void,
  // currentEvent: Event,
  // setCurrentEventById: (new_event_id: number) => void,
  // updateCurrentMessageRef: React.RefObject<HTMLInputElement>
  goToTitle: () => void
}

// {currentEvent, setCurrentEventById, updateCurrentMessageRef}
export const Chat: React.FC<Props> = ({event_player, forceUpdate, goToTitle}) => {
    // console.log(messages)
    const [currentMessage, setCurrentMessage] = React.useState(event_player.current_event.messages[0])
    const [nextMessageButtonVisible, setNextMessageButtonVisible] = React.useState(false)
    const [showOptions, setShowOptions] = React.useState(false)
    
    function playNextEvent(event_id: number) {
      // debug
      // console.log(`Playing event # ${event_id}`)
      
      // special case: if this is an end game event, reset game
      // and go to title screen
      if (event_player.event_graph.is_exit_event(event_id)) {
        event_player.set_current_event_by_id(1)
        setCurrentMessage(event_player.current_event.messages[0])
        goToTitle()
      } else if (event_id !== -1) {
        // otherwise, if not the end event...
        // if the event_id is -1, this message does not trigger
        // going to a new event, so do nothing.
        event_player.set_current_event_by_id(event_id)
        setCurrentMessage(event_player.current_event.messages[0])
        forceUpdate()
        // setCurrentEventById(event_id)
        // setCurrentMessage(newCurrentMessage)
      }
    }
    
    // useImperativeHandle(updateCurrentMessageRef, () => ({
      
    //   setNewCurrentMessage() {
    //     setCurrentMessage(currentMessage.messages[0])
    //   }
      
    // }))
    
    
    function setNextMessageAsCurrent() {
      var next_message_id = currentMessage.id + 1
      var next_message = event_player.current_event.get_message_by_id(next_message_id)
      setCurrentMessage(next_message)
    }
    
    function handleMessageComplete() {
      // console.log("Handling message complete")
      hideNextMessageButton()
      if (currentMessage.to_event_id !== -1) {
        playNextEvent(currentMessage.to_event_id)
      } else {
        setNextMessageAsCurrent()
      }
      
    }
    
    function handleShowOptions() {
      // console.log("Showing message options")
      hideNextMessageButton()
      setShowOptions(true)
    }
    
    // function onPressEnter() {
    //   handleMessageComplete()
    // }
    
    function onClickNextMessageButton() {
      // console.log("Next message button clicked")
      if (currentMessage.has_options()) {
        // console.log(`Current message has options: ${currentMessage.options}`)
        handleShowOptions()
      } else {
        handleMessageComplete()
      }
    }
    
    function showNextMessageButton() {
      setNextMessageButtonVisible(true)
    }
    function hideNextMessageButton() {
      setNextMessageButtonVisible(false)
    }
    
    function onOptionSelected(option: Option) {
      // console.log(`Option selected`)
      // console.log(option)
      // if option has no to_event_id, just go to next message
      if (option.to_event_id === -1) {
        setNextMessageAsCurrent()
      } else {
        playNextEvent(option.to_event_id)
      }
    }
    
    // function onMessageWriteComplete() {
    //   // console.log('message write complete!');
    //   // When message is finished being written, if it doesn't have any options,
    //   // fade in "play" button to indicate to user to click or hit enter to go to next message.
    //   // Otherwise, if message does have options, display them!
    //   // if (!currentMessage.has_options()) {
    //   //   // console.log("Showing next message button")
    //   //   console.log(`Current message has options: ${currentMessage.options}`)
    //   //   showNextMessageButton()
    //   // } else {
    //   //   handleShowOptions()
    //   // }
    //   // if (!currentMessage.has_options()) {
    //   //   showNextMessageButton()
    //   // }
    // }
    
    
    
    return (
      <div className="chat">
        <div className="chat--wrapper">
            <ChatMessage key={currentMessage.id} message={currentMessage} showNextMessageButton={showNextMessageButton} hideNextMessageButton={hideNextMessageButton} onOptionSelected={onOptionSelected}></ChatMessage>
            <NextMessageButton visible={nextMessageButtonVisible} onClick={onClickNextMessageButton}></NextMessageButton> 
        </div>
      </div>
    )
  }

