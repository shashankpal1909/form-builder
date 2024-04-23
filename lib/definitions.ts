export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Option = {
  id: string;
  value: string;
};

export type Question = {
  id: string;
  type: string;
  content: string;
  options?: Option[];
  required: boolean;
  hasOtherOption: boolean;
};

export type Section = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

export type Form = {
  id: string;
  title: string;
  sections: Section[];
};

export type Response = {
  id: string;
  value: string;
  questionId: string;
  formId: string;
  userId?: string;
  options: Option[];
};
