import { ASTStepNode, ASTNodeType } from '../../models/AST/AST';
import {
  CSTClickNode,
  CSTReadNode,
  CSTScrollToNode,
  CSTDragNode,
  CSTWriteNode,
  CSTSelectNode,
  CSTDrawNode,
  CSTFollowNode,
} from '../../models/CST/CST';
import {
  IncompleteInnerStep,
  SyntaxCheckErrors,
  IncompleteEndStep,
} from '../../models/SyntaxCheck';

const checkClickNode = (
  clickNode: CSTClickNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  if (!clickNode.element) {
    return {
      type: 'syntax_error',
      errors: [{ location: clickNode.id, reason: 'Missing element' }],
    };
  }
  return {
    type: 'incomplete_node',
    getInnerStep: (missingNextStep: ASTStepNode) => ({
      type: ASTNodeType.Click,
      element: clickNode.element!,
      next: missingNextStep,
    }),
  };
};

const checkReadNode = (
  readNode: CSTReadNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  if (!readNode.element) {
    return {
      type: 'syntax_error',
      errors: [{ location: readNode.id, reason: 'Missing element' }],
    };
  } else {
    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep: ASTStepNode) => ({
        type: ASTNodeType.Read,
        element: readNode.element!,
        next: missingNextStep,
      }),
    };
  }
};

const checkScrollToNode = (
  scrollToNode: CSTScrollToNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  if (!scrollToNode.element) {
    return {
      type: 'syntax_error',
      errors: [{ location: scrollToNode.id, reason: 'Missing element' }],
    };
  } else {
    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep: ASTStepNode) => ({
        type: ASTNodeType.ScrollTo,
        element: scrollToNode.element!,
        next: missingNextStep,
      }),
    };
  }
};

const checkDragNode = (
  dragNode: CSTDragNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  let errors = !dragNode.element
    ? [{ location: dragNode.id, reason: 'Missing element' }]
    : [];
  if (!dragNode.location) {
    errors = [
      ...errors,
      { location: dragNode.id, reason: 'Missing drag location' },
    ];
  }
  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep: ASTStepNode) => ({
        type: ASTNodeType.Drag,
        element: dragNode.element!,
        location: dragNode.location!,
        next: missingNextStep,
      }),
    };
  }
};

const checkWriteNode = (
  writeNode: CSTWriteNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  let errors = !writeNode.element
    ? [{ location: writeNode.id, reason: 'Missing element' }]
    : [];
  if (!writeNode.text || writeNode.text.length === 0) {
    errors = [...errors, { location: writeNode.id, reason: 'Missing text' }];
  }
  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep) => ({
        type: ASTNodeType.Write,
        element: writeNode.element!,
        isExact: writeNode.isExact,
        text: writeNode.text!,
        next: missingNextStep,
      }),
    };
  }
};

const checkSelectNode = (
  selectNode: CSTSelectNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  let errors = !selectNode.element
    ? [{ location: selectNode.id, reason: 'Missing element' }]
    : [];
  if (selectNode.selector) {
    const selector = selectNode.selector;
    switch (selector.selectType) {
      case 'select': {
        if (!selector.option) {
          errors = [
            ...errors,
            { location: selectNode.id, reason: 'Missing option' },
          ];
        }
        if (errors.length > 0) {
          return { type: 'syntax_error', errors };
        } else {
          return {
            type: 'incomplete_node',
            getInnerStep: (missingNextStep) => ({
              type: ASTNodeType.Select,
              element: selectNode.element!,
              option: selector.option!,
              next: missingNextStep,
            }),
          };
        }
      }
      case 'check': {
        if (errors.length > 0) {
          return { type: 'syntax_error', errors };
        } else {
          return {
            type: 'incomplete_node',
            getInnerStep: (missingNextStep) => ({
              type: ASTNodeType.Check,
              element: selectNode.element!,
              isChecked: selector.isChecked,
              next: missingNextStep,
            }),
          };
        }
      }
      case 'radio': {
        if (errors.length > 0) {
          return { type: 'syntax_error', errors };
        } else {
          return {
            type: 'incomplete_node',
            getInnerStep: (missingNextStep) => ({
              type: ASTNodeType.Radio,
              element: selectNode.element!,
              next: missingNextStep,
            }),
          };
        }
      }
    }
  } else {
    errors = [
      ...errors,
      { location: selectNode.id, reason: 'Missing selector' },
    ];
    return { type: 'syntax_error', errors };
  }
};

const checkDrawNode = (
  drawNode: CSTDrawNode,
): IncompleteInnerStep | SyntaxCheckErrors => {
  let errors = !drawNode.element
    ? [{ location: drawNode.id, reason: 'Missing element' }]
    : [];
  if (!drawNode.description) {
    errors = [
      ...errors,
      { location: drawNode.id, reason: 'Missing draw description' },
    ];
  }
  if (errors.length > 0) {
    return { type: 'syntax_error', errors };
  } else {
    return {
      type: 'incomplete_node',
      getInnerStep: (missingNextStep) => ({
        type: ASTNodeType.Draw,
        element: drawNode.element!,
        description: drawNode.description!,
        next: missingNextStep,
      }),
    };
  }
};

const checkFollowNode = (
  followNode: CSTFollowNode,
): IncompleteEndStep | SyntaxCheckErrors => {
  let errors = !followNode.element
    ? [{ location: followNode.id, reason: 'Missing element' }]
    : [];
  if (followNode.nextSectionId) {
    if (errors.length > 0) {
      return { type: 'syntax_error', errors };
    } else {
      return {
        type: 'incomplete_node',
        missingSectionIds: [followNode.nextSectionId],
        getEndStep: (missingNextSections) => {
          if (missingNextSections.length != 1) {
            throw new Error('Wrong number of sections');
          }
          const [nextSection] = missingNextSections;
          return {
            type: ASTNodeType.Follow,
            element: followNode.element!,
            nextSection: nextSection,
          };
        },
      };
    }
  } else {
    errors = [
      ...errors,
      { location: followNode.id, reason: 'Missing next section' },
    ];
    return { type: 'syntax_error', errors };
  }
};

export {
  checkClickNode,
  checkDragNode,
  checkReadNode,
  checkScrollToNode,
  checkWriteNode,
  checkSelectNode,
  checkDrawNode,
  checkFollowNode,
};
