import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  message: string;

  t = TrelloPowerUp.iframe({
    appKey: environment.appKey,
    appName: environment.appName
  });

  constructor() {}

  ngOnInit(): void {
    this.message = this.t.arg('msg');
  }
}
