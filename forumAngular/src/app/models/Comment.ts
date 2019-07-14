import { User } from "./User";

export class Comment {
  id: string;
  creator: User;
  date: number;
  content: string;
}
