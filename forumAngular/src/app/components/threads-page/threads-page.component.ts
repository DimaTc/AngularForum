import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Thread } from "src/app/models/Thread";
import { ThreadsService } from "src/app/threads.service";

@Component({
  selector: "threads-page",
  templateUrl: "./threads-page.component.html",
  styleUrls: ["./threads-page.component.scss"],
})
export class ThreadsPageComponent implements OnInit {
  threads: Thread[];
  @Output() onLoaded = new EventEmitter<boolean>();

  constructor(private threadService: ThreadsService) {
    threadService.getAllThreads().subscribe((res) => {
      if (res["status"] != "ok") {
        this.loadingDone(true);
        return;
      }
      this.threads = res["threads"].map(
        (threadVal) =>
          <Thread>{
            id: threadVal["id"],
            title: threadVal["title"],
            date: threadVal["date"],
            commentsCount: threadVal["comments"],
            views: threadVal["views"],
            lastComment: {
              creator: threadVal.last_comment["creator"],
              date: threadVal.last_comment["date"],
              content: "",
            },
            creator: threadVal["creator"],
          }
      );
      this.loadingDone(true);
    });
  }

  ngOnInit() {}

  loadingDone(done: boolean) {
    this.onLoaded.emit();
  }
}
