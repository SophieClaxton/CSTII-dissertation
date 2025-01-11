import { Message } from '../common/message';
import './clickable.css';

alert('Loaded content script');
console.log('Loaded content script');

// managing element clickability
let isClickable = false;
const selectableElementTags = [
  'img',
  'a',
  'button',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
];

const setupClickabilityListener = () => {
  chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
      case 'close_side_panel':
      case 'clicked_element':
        break;
      case 'toggle_clickability': {
        console.log('received clickability message');
        isClickable = !isClickable;
        console.log(`set clickability to ${isClickable}`);
        updateClassList();
        break;
      }
      case 'toggle_focus': {
        console.log('received focussing message');
        const elementOuterHTML = message.element;

        document.querySelectorAll('*').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to focus');
            element.classList.add('focussed-on');
          } else if (element.outerHTML.includes('focussed-on')) {
            console.log('found element to unfocus');
            element.classList.remove('focussed-on');
          }
        });
        break;
      }
      case 'click_element': {
        console.log('received click element message');
        const elementOuterHTML = message.element;

        document.querySelectorAll('button').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to click');
            element.click();
          }
        });

        document.querySelectorAll('a').forEach((element) => {
          if (element.outerHTML === elementOuterHTML) {
            console.log('found element to click');
            element.click();
          }
        });
      }
    }
  });
};

const updateClassList = () => {
  document.querySelectorAll('*').forEach((element) => {
    if (selectableElementTags.includes(element.tagName.toLowerCase())) {
      if (isClickable) {
        element.classList.add('clickable');
      } else {
        element.classList.remove('clickable');
      }
    }
  });
};

const addClickListeners = () => {
  console.log('adding click listeners');
  document.querySelectorAll('*').forEach((element) => {
    if (selectableElementTags.includes(element.tagName.toLowerCase())) {
      element.addEventListener('click', () => {
        if (isClickable) {
          const message = {
            type: 'clicked_element',
            element: element.outerHTML,
            tag: element.tagName,
          };
          console.log('sending message');
          chrome.runtime.sendMessage(message);
        }
      });
    }
  });
};

setupClickabilityListener();
updateClassList();
addClickListeners();
