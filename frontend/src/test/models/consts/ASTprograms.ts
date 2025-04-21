import { ASTNodeType, ASTScrollToNode } from '../../../side_panel/models/AST/AST';

const scrollToNode: ASTScrollToNode = {
  type: ASTNodeType.ScrollTo,
  next: {
    type: ASTNodeType.End,
  },
  element: {
    outerHTML: 'Blash',
    tag: 'H1',
    url: 'http',
  },
};

const n2 = {
  type: 'Scroll To',
  element: {
    outerHTML:
      '"<h2 class="gem-c-heading__text govuk-heading-l">Government activity</h2>"',
    tag: 'H2',
    textContent: 'Government activity',
    url: 'https://www.gov.uk',
  },
  next: undefined,
  comment: undefined,
};

export { scrollToNode, n2 };
