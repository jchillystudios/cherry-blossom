import React, { useState, useRef } from "react";

import '../styles/components/warning-modal.styles.scss';

import { CustomButton } from './CustomButton';

interface Props {
  goToTitle: (click_event: React.MouseEvent<HTMLElement>) => void,
}

export const Warning: React.FC<Props> = ({goToTitle}) => {

    return (
        <div className="warning-modal--wrapper">
            <div className="warning-modal">
                <div className="warning-modal__text">
                <p  className="warning-modal__p">Welcome to Cherry Blossom!</p>
                <br />
                <p  className="warning-modal__p">This site is not recommended for mobile. Make sure to Allow Sound in your browser's Site Settings if you would like to hear music/sound effects.</p>
                </div>
                <CustomButton onClickAction={goToTitle}>enter</CustomButton>
            </div>
        </div>
    )
}


