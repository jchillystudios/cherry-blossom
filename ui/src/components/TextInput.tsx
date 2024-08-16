import React, { useState, useRef, useEffect } from "react";

import '../styles/components/text-input.styles.scss';

interface Props {
    onChangeHandler?: (e: React.FormEvent<HTMLInputElement>) => void
}

export const TextInput: React.FC<Props> = ({ onChangeHandler }) => {
    
    return (
        <input type="text" 
                className="text-input" 
                onChange={onChangeHandler} 
                placeholder="enter text here"
        />
    )
}