// managing element clickability
let isClickable = false;
const selectableElementTags = ['img', 'a', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const setupClickabilityListener = () => {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('received message');
    if (message.type === 'toggle_clickability') {
      isClickable = !isClickable;
      console.log(`set clickability to ${isClickable}`);
      updateClassList();
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
  document.querySelectorAll('*').forEach((element) => {
    if (selectableElementTags.includes(element.tagName.toLowerCase())) {
      element.addEventListener('click', () => {
        if (isClickable) {
          const message = { type: 'clicked_element', element: element.outerHTML };
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
