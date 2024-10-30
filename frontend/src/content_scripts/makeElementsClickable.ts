import { ClickedElementMessage } from '../common/message';

const highlight_clickable_css = `.clickable { :hover { color: red !important; background-color: yellow !important; opacity: 0.5 !important; outline: 5px solid red !important }}`;

const makeElementsClickable = () => {
  const selectableElementTags = ['img', 'a', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  document.querySelectorAll('*').forEach((element) => {
    if (selectableElementTags.includes(element.tagName.toLowerCase())) {
      element.classList.add('clickable');
      element.addEventListener('click', () => {
        // alert('Clicked element');
        const message: ClickedElementMessage = { type: 'clicked_element', element: element.outerHTML };
        chrome.runtime.sendMessage(message);
      });
    }
  });
};

export { highlight_clickable_css, makeElementsClickable };
