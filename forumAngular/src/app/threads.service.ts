import { Injectable } from "@angular/core";
import { Thread } from "./models/Thread";
import { CommentsService } from "./comments.service";

@Injectable({
  providedIn: "root"
})
export class ThreadsService {
  dummyThreads: Thread[];

  constructor(private comments: CommentsService) {
    this.dummyThreads = [
      {
        id: "1",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563098127,
        comments: comments.getDummyComments(),
        title: "Main Thread",
        views: 20
      },
      {
        id: "2",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563138127,
        comments: [comments.getDummyComments()[0]],
        title: "other thread",
        views: 20
      },
      {
        id: "3",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563138127,
        comments: [comments.getDummyComments()[0]],
        title: "other thread 2",
        views: 20
      },
      {
        id: "4",
        creator: { id: "1", username: "Dima", online: true },
        date: 1563138127,
        comments: [comments.getDummyComments()[0]],
        title: "other thread 3",
        views: 20
      }
    ];
  }

  getDummyThreads(): Thread[] {
    return this.dummyThreads;
  }

  getThreadById(id: string): Thread {
    return this.dummyThreads.find(t => t.id === id);
  }
}
