import { LevelOfSupport } from '../../models/support_and_MII/UserSupport';

const LoSDescription: Record<LevelOfSupport, string> = {
  text: 'The system will only provide instructions, but will indicate which steps have been completed.',
  overlay:
    'The system will provide instructions and show you what you need to interact with by scrolling to it and putting a pink rectangle around it.',
  click: 'The system will perform the next action for you automatically.',
};

const increaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'overlay';
    case 'overlay':
      return 'click';
    case 'click':
      return 'click';
  }
};

const decreaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'text';
    case 'overlay':
      return 'text';
    case 'click':
      return 'overlay';
  }
};

export { LoSDescription, increaseLevelOfSupport, decreaseLevelOfSupport };
