import { Question } from './types';
import rawQuestions from './questions.json';

// Ensure consistent typing for the imported JSON
export const QUESTIONS: Question[] = (rawQuestions as unknown) as Question[];