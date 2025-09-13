export enum Screen {
  Login,
  Dashboard,
}

export type UserRole = 'student' | 'teacher';

export interface User {
  name: string;
  role: UserRole;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // Using string for simplicity, e.g., "2024-10-26T10:00:00"
  location: string;
  organizer: string;
  registrants: string[]; // array of student names
}

// FIX: Added the missing Question interface. This type is used by the Gemini service to generate quiz questions and by the GameScreen component to display them.
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}
