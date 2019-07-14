import { User } from "./User";
import { Comment } from "./Comment";

export class Thread {
  id: string;
  title: string;
  comments: Comment[];
  creator: User;
  views: number;
  date: number;
}
