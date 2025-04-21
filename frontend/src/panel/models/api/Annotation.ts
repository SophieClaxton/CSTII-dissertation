interface Annotation {
  location: string;
  description: string;
}

interface CreateAnnotationRequest {
  location: string;
  description: string;
}

export default Annotation;
export type { CreateAnnotationRequest };
