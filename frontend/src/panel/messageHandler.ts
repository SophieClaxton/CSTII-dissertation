import { Message, MessageType, Port } from '../common/message';

chrome.runtime.connect({ name: Port.SidePanel });
export const content_port = chrome.runtime.connect({ name: Port.Content });

export const setUpMessageHandler = () =>
  chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.type == MessageType.CloseSidePanel) {
      window.close();
    }
  });
