import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
  expand: boolean = false;
  id: number = -1;
  test: number;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadsService
  ) {}
  ngOnInit() {
    this.test = Date.now();
    if (this.thread === undefined) {
      this.expand = true;
      this.route.paramMap.subscribe(params => {
        this.thread = this.threadService.getThreadById(params.get("id"));
      });
    }
  }
}
