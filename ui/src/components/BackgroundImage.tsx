import React, { useState, useRef } from "react";

import '../styles/components/backgroundImage.styles.scss';

interface Props {
  img_path: string; // static files are served from root "public" directory, so give relative path under "public"
}

export const BackgroundImage: React.FC<Props> = ({img_path}) => {
  
  return (
    <img className="background-img" src={img_path}>
    </img>
  )
}




