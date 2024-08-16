import React, { useState, useRef, useEffect } from "react";

import '../styles/components/scene.styles.scss';

import { Chat } from './Chat'
import { BackgroundImage } from './BackgroundImage'
import { CharacterHolder } from './CharacterHolder'
import { EventPlayer } from '../lib/EventPlayer'
import { Jukebox } from './Jukebox'
import { Event } from '../lib/Event'

interface Props {
    // currentEvent: Event,
    // setCurrentEventById: (new_event_id: number) => void,
    // updateCurrentMessageRef: React.RefObject<HTMLInputElement>
    event_player: EventPlayer,
    forceUpdate: () => void,
    goToTitle: () => void
}
//{currentEvent, setCurrentEventById, updateCurrentMessageRef}
export const Scene: React.FC<Props> = ({event_player, forceUpdate, goToTitle}) => {
    
    return (
      <div className="scene">
        <BackgroundImage img_path={event_player.current_event.location.background_image_path}></BackgroundImage>
        <CharacterHolder characters={event_player.current_event.characters} ></CharacterHolder>
        {/* <Chat currentEvent={currentEvent} setCurrentEventById={setCurrentEventById} updateCurrentMessageRef={updateCurrentMessageRef}></Chat> */}
        <Chat event_player={event_player} forceUpdate={forceUpdate} goToTitle={goToTitle}></Chat>
      </div>
    )
  }

