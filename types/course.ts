// types/course.ts
export interface Course {
  id: number;
  name: string;
  instructor: string;
  duration: number;
  website?: string | null;
}
