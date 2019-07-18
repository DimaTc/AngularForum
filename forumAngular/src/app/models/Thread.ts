import { User } from "./User";
import { Comment } from "./Comment";

export class Thread {
  id?: string;
  title: string;
  lastComment?: Comment;
  commentsCount?:number;
  creator: string;
  views?: number;
  date: number;
}
