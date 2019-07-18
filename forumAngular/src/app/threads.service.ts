import { UsersService } from "./users.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { User } from "./models/User";
import { Injectable } from "@angular/core";
import { Thread } from "./models/Thread";
import { CommentsService } from "./comments.service";

@Injectable({
  providedIn: "root"
})
export class ThreadsService {
  dummyThreads: Thread[];

  constructor(
    private comments: CommentsService,
    private http: HttpClient,
    private usersService: UsersService
  ) {}

  addThread(title: string, comment: string) {
    return this.http.post(environment.serverUrl + "api/threads/add", {
      title,
      comment,
      ...this.getAuthObject()
    });
  }

  getAllThreads() {
    return this.http.post(environment.serverUrl + "api/threads", this.getAuthObject());
  }

  getDummyThreads(): Thread[] {
    return this.dummyThreads;
  }

  getThreadById(id: string){
    
    return this.http.post(environment.serverUrl + "api/threads", {
      ...this.getAuthObject(),
      thread_id:id
    });
  }
  getAuthObject(){
    return {
      username:this.usersService.getLoggedInUsername(),
      authToken: localStorage.getItem('authToken')
    }
  }
}
