import { useCallback, useEffect, useState } from 'react';
import {
  ClickedElementMessage,
  ClickElementMessage,
  Message,
  ToggleClickabilityMessage,
  ToggleFocusMessage,
} from '../../common/message';
import InterfaceElement from '../models/InterfaceElement';

const ClickedElementsDisplay = () => {
  const [selecting, setSelecting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [element, setElement] = useState<InterfaceElement | undefined>(
    undefined,
  );
  const [showMeError, setShowMeError] = useState<string | undefined>(undefined);

  const setupElementListener = async () => {
    console.log('running setup');
    chrome.runtime.onMessage.addListener(async (message: Message) => {
      if (message.type === 'clicked_element') {
        console.log('setting element');
        const clickedElementMessage = message as ClickedElementMessage;
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        setElement({
          outerHTML: clickedElementMessage.element,
          url: tab.url || '',
          tag: clickedElementMessage.tag,
        });
        console.log(`got element from url: ${tab.url}`);
      }
    });
  };

  const setupTabChangeListener = useCallback(async () => {
    const tabChangeListener = (
      _: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      console.log(
        `tab updated with status: ${changeInfo.status} and url: ${changeInfo.url} and selecting: ${selecting}`,
      );
      if (changeInfo.status === 'complete') {
        setSelecting(false);
      }
    };
    chrome.tabs.onUpdated.addListener(tabChangeListener);
  }, [selecting]);

  const toggleSelectingElements = async (selecting: boolean) => {
    setSelecting(!selecting);
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    console.log('sending toggle clickability message');
    const toggleClickabilityMessage: ToggleClickabilityMessage = {
      type: 'toggle_clickability',
    };
    chrome.tabs
      .sendMessage(tab.id!, toggleClickabilityMessage)
      .catch((error) => console.log(error));
  };

  const toggleFocusOnElement = async (isFocused: boolean) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (!element || tab.url != element.url) {
      setShowMeError('We are not on the page that element came from');
      return;
    }
    console.log('sending focus on message');
    const message: ToggleFocusMessage = {
      type: 'toggle_focus',
      element: element.outerHTML,
    };
    chrome.tabs
      .sendMessage(tab.id!, message)
      .catch((error) => console.log(error));
    setShowMeError(undefined);
    setIsFocused(!isFocused);
  };

  const clickElement = async (isFocused: boolean) => {
    console.log(`element isFocused: ${isFocused}`);
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (!element || tab.url != element.url) {
      setShowMeError('We are not on the page that element came from');
      return;
    }
    if (isFocused) {
      setShowMeError('First stop showing the element');
      return;
    }
    console.log('sending active-click message');
    const message: ClickElementMessage = {
      type: 'click_element',
      element: element.outerHTML,
    };
    chrome.tabs
      .sendMessage(tab.id!, message)
      .catch((error) => console.log(error));
    setShowMeError(undefined);
  };

  useEffect(() => {
    setupElementListener();
    setupTabChangeListener();
  }, [setupTabChangeListener]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => toggleSelectingElements(selecting)}>
        {selecting ? 'Stop Selecting Elements' : 'Start Selecting Elements'}
      </button>
      {element && (
        <>
          <p>{element.outerHTML}</p>
          <button onClick={() => toggleFocusOnElement(isFocused)}>
            {isFocused
              ? 'Stop showing me that element'
              : 'Show me that element'}
          </button>
        </>
      )}
      {element && ['A', 'BUTTON'].includes(element.tag) && (
        <button onClick={() => clickElement(isFocused)}>
          Click that element for me
        </button>
      )}
      {showMeError ?? <p>{showMeError}</p>}
    </div>
  );
};

export default ClickedElementsDisplay;
