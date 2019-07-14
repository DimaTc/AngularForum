import { Injectable } from "@angular/core";
import { Comment } from "./models/Comment";

@Injectable({
  providedIn: "root"
})
export class CommentsService {
  dummyComments: Comment[];

  constructor() {
    this.dummyComments = [
      {
        id: "1",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563098127,
        content: "Some text"
      },
      {
        id: "2",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563198127,
        content: "Some more text"
      }
    ];
  }

  getDummyComments(): Comment[] {
    return this.dummyComments;
  }
}
