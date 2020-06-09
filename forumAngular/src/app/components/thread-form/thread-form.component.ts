import { ThreadsService } from './../../threads.service';
import { Component } from "@angular/core";
import { Router } from '@angular/router';
// import {  } from 'events';

@Component({
  selector: "app-thread-form",
  templateUrl: "./thread-form.component.html",
  styleUrls: ["./thread-form.component.scss"]
})
export class ThreadFormComponent {

  title: string = "";
  comment: string = "";
  showErrors: boolean = false;


  constructor(private threadService: ThreadsService, private router: Router) {}

  onSubmit() {
    if (this.title.length === 0 || this.comment.length === 0) {
      console.log("Error");
      this.showErrors = true;
      return;
    }
    this.threadService.addThread(this.title, this.comment).subscribe(res=>{
      if(res['status'] == 'error')
        console.log(res['error']);
      else if(res['status'] === "ok")
        this.router.navigate([''])
    });
  }

}
