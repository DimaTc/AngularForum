import { User } from "./models/User";
import { UsersService } from "./users.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Comment } from "./models/Comment";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class CommentsService {
  constructor(private http: HttpClient, private usersService: UsersService) {}
  getThreadComments(id: string) {
    return this.http.post(environment.serverUrl + "/api/comments", {
      thread_id: id,
      ...this.getAuthObject()
    });
  }

  addNewComment(threadId: string, content: string) {
    return this.http.post(environment.serverUrl + "/api/comments/add", {
      "thread_id":threadId,
      content,
      ...this.getAuthObject()
    });
  }

  getAuthObject() {
    return {
      username: this.usersService.getLoggedInUsername(),
      authToken: localStorage.getItem("authToken")
    };
  }
}
