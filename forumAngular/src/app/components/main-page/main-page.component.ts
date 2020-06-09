import { UsersService } from "./../../users.service";
import { User } from "./../../models/User";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent {
  currentUser: User;
  waiting = false;
  childWaiting = true;
  failed = false;
  constructor(private router: Router, private userService: UsersService) {
    this.getUser();
  }

  getUser() {
    if (!this.waiting && !this.failed) {
      this.waiting = true;
      this.userService
        .getUserFromServer()
        .then(res => {
          this.currentUser = {
            username: res["username"],
            id: res["id"],
            online: true
          };
          this.userService.setLoggedInUser(this.currentUser);
        })
        .catch(res => {
          this.router.navigate(["login"]);
          this.failed = true;
        })
        .finally(() => {
          this.waiting = false;
        });
    }
  }
  logout() {
    this.userService.logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    this.currentUser = undefined;
    this.router.navigate(["login"]);
  }

  childLoaded(){
    this.childWaiting = false;
    console.log("Done")
  }
}
