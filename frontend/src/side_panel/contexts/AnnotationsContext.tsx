import { createContext } from 'react';

interface AnnotationsContextInfo {
  annotationsMap: Map<string, string>;
  showAnnotations: boolean;
}

const AnnotationsContex = createContext<AnnotationsContextInfo>({
  annotationsMap: new Map(),
  showAnnotations: false,
});

export { AnnotationsContex };
export type { AnnotationsContextInfo };
