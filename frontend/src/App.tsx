import reactLogo from './assets/react.svg';
import viteLogo from '../public/vite.svg';
import './App.css';
import { setUpMessageHandler } from './panel/messageHandler';

function App() {
  setUpMessageHandler();

  const onClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(`found active tab ${tab.id}`);

    chrome.permissions
      .contains({ permissions: ['scripting'] })
      .then((value) => console.log(`has scripting permissions: ${value}`));

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        func: () => {
          alert('Hello from my extension');
        },
      })
      .then(() => console.log('Attempted to inject script'))
      .catch(() => console.log('Could not inject script'));
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClick}>Say Hi</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
