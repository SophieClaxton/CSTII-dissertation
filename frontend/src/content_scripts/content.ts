alert('content script injected');

// setup port
const contentPort = chrome.runtime.connect({ name: 'content' });

// managing element clickability
let isClickable = false;

contentPort.onMessage.addListener((message) => {
  if (message.type === 'toggle_clickability') {
    console.log('toggling clickability');
    isClickable = !isClickable;
    updateClassList();
  }
});

const selectableElementTags = ['img', 'a', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const updateClassList = () => {
  alert('updating element class lists');
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
updateClassList();

document.querySelectorAll('*').forEach((element) => {
  if (selectableElementTags.includes(element.tagName.toLowerCase())) {
    console.log(element.tagName);
    element.addEventListener('click', () => {
      if (isClickable) {
        alert('Clicked element');
        const message = { type: 'clicked_element', element: element.outerHTML };
        contentPort.postMessage(message);
      }
    });
  }
});
