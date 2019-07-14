import { Component, OnInit } from "@angular/core";
import { Thread } from "src/app/models/Thread";
import { ThreadsService } from "src/app/threads.service";

@Component({
  selector: "threads-page",
  templateUrl: "./threads-page.component.html",
  styleUrls: ["./threads-page.component.scss"]
})
export class ThreadsPageComponent implements OnInit {
  threads: Thread[];

  constructor(private threadService: ThreadsService) {
    this.threads = threadService.getDummyThreads();
  }

  ngOnInit() {}
}
