import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-user-small-profile',
  templateUrl: './user-small-profile.component.html',
  styleUrls: ['./user-small-profile.component.scss']
})
export class UserSmallProfileComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
