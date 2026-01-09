
export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  category: string;
  color: string;
}

export enum QuestionType {
  NUMBER_TO_NAME = 'NUMBER_TO_NAME',
  NAME_TO_NUMBER = 'NAME_TO_NUMBER',
  SYMBOL_TO_BOTH = 'SYMBOL_TO_BOTH'
}

export interface Question {
  type: QuestionType;
  targetElement: ElementData;
  options: string[];
  correctAnswer: string;
}
