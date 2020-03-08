import { Component, OnInit } from '@angular/core';
import { TrelloService } from './services/trello.service';
declare let TrelloPowerUp: any;
declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'powerUpNextTask';
  // promise = trelloPowerUp.Promise;
  NEXT_TASK = 'https://i.imgur.com/5xkAn5M.png';
  UNLOCK = 'https://i.imgur.com/mMlyvyN.png';

  constructor(private trelloService: TrelloService) {}

  ngOnInit() {
    this.trelloInit();
  }

  showIframeAuth(t) {
    return t.popup({
      title: 'Authorize to continue',
      url: '/authorize'
    });
  }

  showIframeNext(t, token) {
    return t.card('all')
      .then((card) => {
        const idCard = card.id;
        const idList = card.idList;
        t.board('all')
        .then((board) => {
          const idBoard = board.id;
          this.trelloService.getAllListBoard(idBoard, token)
            .then((data) => {
              console.log(data);
              const index = data.findIndex(list => list.id === idList) + 1;
              if (index < data.length) {
                const newListId = data[index].id;
                this.trelloService.moveCard(idCard, newListId, token)
                .then((resp) => {
                  console.log(resp);
                })
                .catch((error) => {
                  console.log(error);
                });
              } else {
                t.hideCard();
                return t.alert({
                  message: 'Proceso terminado',
                  duration: 6,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
  }

  trelloInit() {
    window.TrelloPowerUp.initialize({
      'card-buttons': (t, options) => {
        return t.getRestApi()
          .getToken()
          .then((token) => {
            if (!token) {
              return [{
                icon: this.UNLOCK,
                text: 'Accept Auth',
                // tslint:disable-next-line:no-shadowed-variable
                callback:  (t) => {
                  this.showIframeAuth(t);
                }
              }];
            } else {
              return [{
                icon: this.NEXT_TASK,
                text: 'Next Task',
                // tslint:disable-next-line:no-shadowed-variable
                callback:  () => {
                  this.showIframeNext(t, token);
                }
              }];
            }
          });
      }
    }, {
        appKey: 'a956c8bac233d7840d394f901dc85d16',
        appName: 'Next_Task'
    });
  }
}
