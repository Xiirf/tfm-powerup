import { Component, OnInit } from '@angular/core';
import { TrelloService } from 'src/app/services/trello.service';
import { ConditionsService } from 'src/app/services/conditions.service';
import { rejects } from 'assert';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit{

  message: string;

  t = TrelloPowerUp.iframe({
    appKey: 'a956c8bac233d7840d394f901dc85d16',
    appName: 'Next_Task'
  });

  constructor() {}

  ngOnInit(): void {
    this.message = this.t.arg('msg');
  }
}
