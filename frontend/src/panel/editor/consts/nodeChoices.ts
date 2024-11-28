import { getNextStepId } from '../../models/programComponent/getters';
import {
  EditorInnerStep,
  EditorSection,
  EditorStepType,
  EditorSubsection,
} from '../../models/programComponent/ProgramComponent';

const innerStepNodeChoices = (section: EditorSection | EditorSubsection): EditorInnerStep[] => [
  {
    id: getNextStepId(section),
    type: EditorStepType.Click,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.Read,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.ScrollTo,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.Drag,
  },
];

export { innerStepNodeChoices };
