import { useEffect, useState } from 'react';
import { ClickedElementMessage, Message, MessageType } from '../common/message';

const ClickedElementsDisplay = () => {
  const setupElementListener = async () => {
    console.log('running setup');
    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.type === MessageType.ClickedElement) {
        console.log('setting element');
        const elementText = (message as ClickedElementMessage).element;
        setElement(elementText);
      }
    });
  };

  const setupTabChangeListener = async () => {
    const tabChangeListener = (_: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      console.log(
        `tab updated with status: ${changeInfo.status} and url: ${changeInfo.url} and selecting: ${selecting}`,
      );
      if (changeInfo.status === 'complete') {
        setSelecting(false);
      }
    };
    chrome.tabs.onUpdated.addListener(tabChangeListener);
  };

  const sendClickabilityMessage = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log('sending message');
    chrome.tabs.sendMessage(tab.id!, { type: 'toggle_clickability' }).catch((error) => console.log(error));
  };

  const toggleSelectingElements = (selecting: boolean) => {
    setSelecting(!selecting);
    sendClickabilityMessage();
  };

  const [selecting, setSelecting] = useState(false);
  const [element, setElement] = useState<string | undefined>(undefined);
  useEffect(() => {
    setupElementListener();
    setupTabChangeListener();
  }, []);

  return (
    <div style={{ display: 'block' }}>
      <button onClick={() => toggleSelectingElements(selecting)}>
        {selecting ? 'Stop Selecting Elements' : 'Start Selecting Elements'}
      </button>
      {element && <p>{element}</p>}
    </div>
  );
};

export default ClickedElementsDisplay;
