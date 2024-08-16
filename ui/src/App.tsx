import { useCallback, useState, useEffect, useRef } from 'react'

import './styles/main.styles.scss';

import { Scene } from './components/Scene'
import { EventPlayer } from './lib/EventPlayer'
import { Title } from './components/Title'
import { Jukebox } from './components/Jukebox'
import { Warning } from './components/Warning';
import { Screen } from './data/Enums';
import { Visualizer } from './components/Visualizer';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

var event_player = new EventPlayer();

// debug starting from event (i.e., put any event ID # in here
// to have the game start at that event!)
event_player.set_current_event_by_id(1);

function App() {
  const [appState, setAppState] = useState({});
  const forceUpdate = useCallback(() => setAppState({}), [])
  const [currentScreen, setCurrentScreen] = useState(Screen.Warning);

  function goToTitle() {
    setCurrentScreen(Screen.Title)
  }

  function goToGame(click_event: React.MouseEvent<HTMLElement>) {
    // setOnTitle(false)
    setCurrentScreen(Screen.Game)
  }

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">

          {/* Switch between title screen / main gameplay scene */}
          <main className="App--window">
            
              {/* Put Jukebox at root so first event's music can play on title */}
              <Jukebox music_path={event_player.current_event.location.music_path}></Jukebox>

              {/* Warning screen */}
              {
                currentScreen === Screen.Warning
                ?
                  <Warning goToTitle={goToTitle}></Warning>
                :
                  <></>
              }

              {/* Title screen */}
              {
                currentScreen === Screen.Title
                ?
                  <Title goToGame={goToGame}></Title>
                :
                  <></>
              }

              {/* Game screen */}
              {
                currentScreen === Screen.Game
                ?
                  <Scene event_player={event_player} forceUpdate={forceUpdate} goToTitle={goToTitle}></Scene>
                :
                  <></>
              }
            </main>
            
          </div>
        } />
        
        
        {/* Visualize network of events using CytoscapeJS. Suppress this to disable Visualizer. */}
        <Route path="/visualizer" element={<Visualizer event_player={event_player} />} />
        
      </Routes>
    </BrowserRouter>
    
    
      
  )
}

export default App
