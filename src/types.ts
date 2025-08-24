export type Gender = 'male' | 'female';

export interface Submission {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: Gender;
  acceptedTC: boolean;
  country: string;
  pictureBase64?: string;
  source: string;
}