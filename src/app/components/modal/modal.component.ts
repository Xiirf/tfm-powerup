import { Component, OnInit } from '@angular/core';
import { TrelloService } from 'src/app/services/trello.service';
import { ConditionsService } from 'src/app/services/conditions.service';
import { rejects } from 'assert';
import { environment } from 'src/environments/environment';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit{

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
