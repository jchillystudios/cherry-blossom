import React, { useState, useRef } from "react";
import '../styles/components/characterholder.styles.scss';

import { CharacterCard } from "./CharacterCard"
import { Character } from "../lib/Character"


interface Props {
  characters: Array<Character>,
}

export const CharacterHolder: React.FC<Props> = ({characters}) => {
    
    return (
      <div className="characters">
        {
          characters.map(function(c, ix) {
            return <CharacterCard key={c.id} character={c} ></CharacterCard>
          })
        }
      </div>
    )
  }
