import { LevelOfSupport } from '../../models/support_and_MII/UserSupport';

const LoSDescription: Record<LevelOfSupport, string> = {
  text: 'The system will only provide instructions, but will indicate which steps have been completed.',
  hints:
    'The system will provide instructions and show you what you need to interact with by scrolling to it and putting a pink rectangle around it.',
  auto: 'The system will perform the next action for you automatically.',
};

const increaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'hints';
    case 'hints':
      return 'auto';
    case 'auto':
      return 'auto';
  }
};

const decreaseLevelOfSupport = (level: LevelOfSupport): LevelOfSupport => {
  switch (level) {
    case 'text':
      return 'text';
    case 'hints':
      return 'text';
    case 'auto':
      return 'hints';
  }
};

export { LoSDescription, increaseLevelOfSupport, decreaseLevelOfSupport };
