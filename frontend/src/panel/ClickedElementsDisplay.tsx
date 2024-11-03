import { useState } from 'react';
import { ClickedElementMessage, Message, MessageType } from '../common/message';
import { content_port } from './messageHandler';

enum ButtonFunc {
  StartSelecting,
  StopSelecting,
}

const ClickedElementsDisplay = () => {
  const startSelectingElements = async () => {
    setButtonLabel('Stop Selecting Elements');
    setButtonAction(ButtonFunc.StopSelecting);

    content_port.postMessage({ type: 'toggle_clickability' });
    content_port.onMessage.addListener((message: Message) => {
      if (message.type === MessageType.ClickedElement) {
        console.log('setting element');
        const elementText = (message as ClickedElementMessage).element;
        setElement(elementText);
      }
    });
  };

  const stopSelectingElements = () => {
    setButtonLabel('Start Selecting Elements');
    setButtonAction(ButtonFunc.StartSelecting);

    content_port.postMessage({ type: 'toggle_clickability' });
  };

  const [buttonLabel, setButtonLabel] = useState('Start Selecting Elements');
  const [buttonAction, setButtonAction] = useState<ButtonFunc>(ButtonFunc.StartSelecting);
  const [element, setElement] = useState<string | undefined>(undefined);

  return (
    <div style={{ display: 'block' }}>
      <button onClick={buttonAction === ButtonFunc.StartSelecting ? startSelectingElements : stopSelectingElements}>
        {buttonLabel}
      </button>
      {element && <p>{element}</p>}
    </div>
  );
};

export default ClickedElementsDisplay;
