import { ContentScriptMessage, Port } from '../common/message';

chrome.runtime.connect({ name: Port.SidePanel });

export const setUpMessageHandler = () =>
  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type == 'close_side_panel') {
      window.close();
    }
  });
