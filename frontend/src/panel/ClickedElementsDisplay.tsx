import { useState } from 'react';
import { ClickedElementMessage, Message, MessageType } from '../common/message';
import { highlight_clickable_css, makeElementsClickable } from '../content_scripts/makeElementsClickable';

const ClickedElementsDisplay = () => {
  const startSelectingElements = async () => {
    setButtonLabel('Stop Selecting Elements');
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        func: makeElementsClickable,
      })
      .then(() => console.log('registration complete'))
      .catch((err) => console.warn('unexpected error', err));
    chrome.scripting.insertCSS({ target: { tabId: tab.id! }, css: highlight_clickable_css });
    setButtonAction(false);

    chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
      if (change.url && tabId === tab.id!) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: makeElementsClickable,
        });
        chrome.scripting.insertCSS({ target: { tabId: tab.id! }, css: highlight_clickable_css });
      }
    });

    chrome.runtime.onMessage.addListener((message: Message) => {
      if (message.type === MessageType.ClickedElement) {
        console.log('setting element');
        const elementText = (message as ClickedElementMessage).element;
        setElement(elementText);
      }
    });
  };

  const stopSelectingElements = () => {
    setButtonLabel('Start Selecting Elements');
    setButtonAction(true);
  };

  const [buttonLabel, setButtonLabel] = useState('Start Selecting Elements');
  const [buttonAction, setButtonAction] = useState<boolean>(true);
  const [element, setElement] = useState<string | undefined>(undefined);

  return (
    <div style={{ display: 'block' }}>
      <button onClick={buttonAction ? startSelectingElements : stopSelectingElements}>{buttonLabel}</button>
      {element && <p>{element}</p>}
    </div>
  );
};

export default ClickedElementsDisplay;
