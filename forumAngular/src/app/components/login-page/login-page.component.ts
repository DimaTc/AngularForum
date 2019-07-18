import { UsersService } from "./../../users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent {
  targetForm: String = "login";

  constructor(private router: Router, private userService: UsersService) {
    this.targetForm = router.url.replace("/", "");
    // if (userService.getLoggedInUser() != undefined) router.navigate([""]);
  }
}
