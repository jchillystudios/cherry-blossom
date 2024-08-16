import React, { useState, useRef } from "react";

import '../styles/components/custom-button.styles.scss';

interface Props {
    children?: string,
    onClickAction: (click_event: React.MouseEvent<HTMLElement>) => void,
}

export const CustomButton: React.FC<Props> = ({ children, onClickAction }) => {
  
    return (
        <button className="custom-button" onClick={onClickAction}>
            { children }
        </button>
    )
}