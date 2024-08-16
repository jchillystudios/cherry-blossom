import React, { useState, useRef } from "react";

import '../styles/components/cookie-notification.styles.scss';

interface Props {

}

export const CookieNotification: React.FC<Props> = ({}) => {
    const [cookieNotificationActive, setCookieNotificationActive] = useState(" active");

    function onClickCookiesOkay(click_event: React.MouseEvent<HTMLElement>) {
        // console.log("cookie consent banner clicked");
        setCookieNotificationActive("");
    }

    return (
      <div className={`cookie-notification-container${cookieNotificationActive}`}>
        <p>We use cookies on this website.</p>
        <button className="cookie-notification-btn" onClick={onClickCookiesOkay}>Okay</button>
      </div>
    )
  }

