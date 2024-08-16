import React, { useState, useRef } from "react";

import '../styles/components/title.styles.scss';
import { MainLogo } from './MainLogo';
import {CustomButton} from './CustomButton';

interface Props {
  goToGame: (click_event: React.MouseEvent<HTMLElement>) => void,
}

export const Title: React.FC<Props> = ({goToGame}) => {

    return (
        <div className="title">
            <div className="title__logo">
                <MainLogo />
                
                <h1 className="title__text">cherry blossom</h1>
            </div>

            <div className="title__button">
                <CustomButton onClickAction={goToGame}>play game</CustomButton>
            </div>
        </div>
    );
}


