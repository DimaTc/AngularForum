import { Comment } from "./../../models/Comment";
import { CommentsService } from "./../../comments.service";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Thread } from "src/app/models/Thread";
import { ThreadsService } from "src/app/threads.service";

@Component({
  selector: "thread",
  templateUrl: "./Thread.component.html",
  styleUrls: ["./Thread.component.scss"]
})
export class ThreadComponent implements OnInit {
  @Input("thread")
  thread: Thread;
  comments: Comment[] = [];
  newComment: string;
  loadingComments: boolean = false;
  loadingThread: boolean = false;
  showForm: boolean = false;
  expand: boolean = false;
  sendingComment: boolean = false;
  id: number = -1;
  test: number;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadsService,
    private commentsService: CommentsService,
    private _location: Location
  ) {}
  ngOnInit() {
    this.test = Date.now();
    if (this.thread === undefined) {
      this.expand = true;
      this.route.paramMap.subscribe(params => {
        let threadId = params.get("id");
        this.loadingThread = true;
        this.loadingComments = true;
        this.threadService.getThreadById(threadId).subscribe(res => {
          this.thread = {
            id: res["threads"][0]["id"],
            title: res["threads"][0]["title"],
            date: res["threads"][0]["date"],
            creator: res["threads"][0]["creator"]
          };
          this.loadingThread = false;
        });
        this.commentsService.getThreadComments(threadId).subscribe(res => {
          this.comments = res["comments"].map(
            comment =>
              <Comment>{
                date: comment["date"],
                creator: comment["creator"],
                content: comment["content"],
                id: comment["id"]
              }
          );
          this.loadingComments = false;
        });
      });
    }
  }

  backClicked(){
    this._location.back();
  }

  onSubmit() {
    if (this.newComment == "") {
      this.showForm = false;
      return;
    }
    this.sendingComment = true;
    this.commentsService
      .addNewComment(this.thread.id, this.newComment)
      .subscribe(res => {
        if (res["status"] === "ok") this.showForm = false;
        this.comments.push(res["comment"]);
        this.sendingComment = false;
      });
    this.newComment = "";

  }
}
