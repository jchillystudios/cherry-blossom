import React, { useState, useRef } from "react";

import '../styles/components/nextMessageButton.styles.scss';

interface Props {
    visible: boolean,
    onClick: () => void
}

export const NextMessageButton: React.FC<Props> = ({visible, onClick}) => {
    
    
    return (
      <div className="next-message-button">
        {
            visible ?
                <div className="next-message-button--wrapper" onClick={onClick}>
                    <div className="next-message-button--arrow">&#10132;</div>
                    <div className="next-message-button--circle"></div>
                </div>
            :
              <div className="next-message-button--wrapper">
              </div>
        }
        
      </div>
    )
  }
