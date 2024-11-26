import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import Editor from './panel/editor/Editor';

enum Screen {
  Home = 'Home',
  Editor = 'Editor',
}

function App() {
  setUpMessageHandler();

  const [screen, setScreen] = useState<Screen>(Screen.Home);

  switch (screen) {
    case Screen.Home:
      return <HomeScreen goEditor={() => setScreen(Screen.Editor)} />;
    case Screen.Editor:
      return <Editor goHome={() => setScreen(Screen.Home)} />;
  }
}

export default App;
