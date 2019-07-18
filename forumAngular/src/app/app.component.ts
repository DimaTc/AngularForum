import { User } from './models/User';
import { UsersService } from './users.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser :User;
  constructor(private userService: UsersService) {
    userService.getUserFromServer().then(
      res=>{
        this.currentUser = {
          username:res['username'],
          id:res['id'],
          online:true
        }
      });
  }
}
