import { MessageType } from '../common/message';

export const setUpMessageHandler = () =>
  chrome.runtime.onMessage.addListener((message) => {
    if (message == MessageType.CloseSidePanel) {
      window.close();
    }
  });
