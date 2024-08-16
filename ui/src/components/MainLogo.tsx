import React, { useState, useRef } from "react";

import '../styles/components/main-logo.styles.scss';

interface Props {
  
}

export const MainLogo: React.FC<Props> = ({}) => {
  
    return (
        <div className="main-logo">
            <img className="main-logo__logo" alt="logo" src="img/graphics/logo.png" />
        </div>
    )
}