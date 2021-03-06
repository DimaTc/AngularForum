import { Injectable } from "@angular/core";
import { User } from "./models/User";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  signedUser: User;
  constructor(private http: HttpClient) {}

  logout() {
    let token: string = localStorage.getItem("authToken");
    this.http
      .post(environment.serverUrl + "/api/logout", {
        username: this.signedUser.username,
        authToken: token
      })
      .subscribe(res => {
      });
  }

  setLoggedInUser(user: User) {
    this.signedUser = user;
    localStorage.setItem("username",user.username)
  }

  getLoggedInUser(): User {
    // if(this.signedUser === undefined)
      // return {username:localStorage.getItem('username'),online:true};
    return this.signedUser;
  }
  getLoggedInUsername(): string {
    if(this.signedUser === undefined)
      return localStorage.getItem('username');
    return this.signedUser.username;
  }

  login(username: string, password: string) {
    let user = {
      username,
      password
    };
    return this.http.post(environment.serverUrl + "api/login", user);
  }

  signup(username: string, password: string, email: string) {
    let user = {
      username,
      password,
      email
    };
    return this.http.post(environment.serverUrl + "api/signup", user);
  }

  getUserFromServer(): Promise<any> {
    let token: string = localStorage.getItem("authToken");
    let path = environment.serverUrl + "api/get_user"; 
    return new Promise((resolved, reject) => {
      this.http
        .post(environment.serverUrl + "api/get_user", { authToken: token })
        .subscribe(res => {
          if (res["status"] == "found") resolved(res);
          else reject(res);
        });
    });
  }
}
