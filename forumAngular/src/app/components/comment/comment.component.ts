import { Component, OnInit, Input } from "@angular/core";
import { Comment } from "src/app/models/Comment";

@Component({
  selector: "comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.scss"]
})
export class CommentComponent implements OnInit {
  @Input("comment")
  comment: Comment;
  constructor() {}

  ngOnInit() {}
}
