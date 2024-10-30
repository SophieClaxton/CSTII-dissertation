import { MessageType, Port } from '../common/message';

chrome.runtime.connect({ name: Port.SidePanel });

export const setUpMessageHandler = () =>
  chrome.runtime.onMessage.addListener((message) => {
    if (message == MessageType.CloseSidePanel) {
      window.close();
    }
  });
