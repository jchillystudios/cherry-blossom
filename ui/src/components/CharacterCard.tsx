import React, { useState, useRef } from "react";
import { Character } from '../lib/Character'

import '../styles/components/charactercard.styles.scss';

interface Props {
    character: Character
}

export const CharacterCard: React.FC<Props> = ({character}) => {

    return (
      <div className={`character
                      ${character.alignment === "left" ? "character__left" : "character__right"}
      `}>
        {
          character.alignment === "left"
          ?
            <img className="character__img character__img--left" src={character.img_path}></img>
          :
            <img className="character__img character__img--right" src={character.img_path}></img>
        }
      </div>
    )
  }
