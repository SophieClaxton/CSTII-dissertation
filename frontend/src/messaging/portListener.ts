import { ContentScriptMessage, Port } from './message';

export const setUpPortListener = () => {
  chrome.runtime.connect({ name: Port.SidePanel });

  chrome.runtime.onMessage.addListener((message: ContentScriptMessage) => {
    if (message.type == 'close_side_panel') {
      window.close();
    }
  });
};
