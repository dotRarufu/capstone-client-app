export interface Project {
  name: string;
  id: number;
  title: string;
  section: string | null;
  members: string[];
  isDone: boolean;
}
