import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';
import { useState } from 'react';
import HomeScreen from './panel/components/HomeScreen';
import Editor from './panel/editor/Editor';
import Editor2 from './panel/editor/Editor2';

enum Screen {
  Home = 'Home',
  Editor1 = 'Editor1',
  Editor2 = 'Editor2',
}

function App() {
  setUpMessageHandler();

  const [screen, setScreen] = useState<Screen>(Screen.Home);

  switch (screen) {
    case Screen.Home:
      return <HomeScreen goEditor1={() => setScreen(Screen.Editor1)} goEditor2={() => setScreen(Screen.Editor2)} />;
    case Screen.Editor1:
      return <Editor goHome={() => setScreen(Screen.Home)} />;
    case Screen.Editor2:
      return <Editor2 goHome={() => setScreen(Screen.Home)} />;
  }
}

export default App;
