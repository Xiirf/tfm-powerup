import { Component, OnInit } from '@angular/core';
import { TrelloService } from './services/trello.service';
import { environment } from 'src/environments/environment';
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
      }, 'card-back-section': (t, options) => {
        return t.getRestApi()
          .getToken()
          .then((token) => {
            if (token) {
              return [{
                title: 'CheckList Conditions',
                icon: this.NEXT_TASK, // Must be a gray icon, colored icons not allowed.
                content: {
                  type: 'iframe',
                  url: t.signUrl('./checklist'),
                  height: 250 // Max height is 500
                }
              }];
            }
          });
      }
    }, {
        appKey: environment.appKey,
        appName: environment.appName
    });
  }

  showIframeAuth(t) {
    return t.popup({
      title: 'Authorize to continue',
      url: '/authorize'
    });
  }

  showIframeNext(t, token) {
    // Récupération de la carte actuelle
    return t.card('all')
      .then((card) => {
        const idCard = card.id;
        // Récupération du board actuel
        this.getNextTask()
        .then((newListId) => {
          this.trelloService.moveCard(idCard, newListId, token)
            .then((resp) => {
              console.log(resp);
            })
            .catch((error) => {
              console.log(error);
            });
        }).catch((error) => {
          if (!error) {
            t.hideCard();
            return t.alert({
              message: 'Proceso terminado',
              duration: 6,
            });
          } else {
            console.log(error);
            this.showModal(error, t);
          }
        });
      });
  }

  getNextTask() {
    return new Promise<any>( (resolve, reject) => {
      // Get condition and next tasks
      const conditions = JSON.parse(localStorage.getItem('nextTaskConditions'));
      if (!conditions) {
        reject(null);
      } else if (conditions.length === 1 && conditions[0].conditions.length === 0) {
        resolve(conditions[0].idTask);
      } else {
        conditions.forEach(element => {
          if (!(element.conditions.find(condition => condition.isChecked === false))) {
            resolve(element.idTask);
          }
        });
      }
      reject('You have to end some prerequisite to have a next task !');
    });
  }

  showModal(msg: string, t) {
    t.modal({
      // the url to load for the iframe
      url: '/modal',
      accentColor: '#F2D600',
      args: { msg },
      // initial height for iframe
      height: 100, // not used if fullscreen is true
      // whether the modal should stretch to take up the whole screen
      fullscreen: false,
      // optional function to be called if user closes modal (via `X` or escape, etc)
      callback: () => console.log('Goodbye.'),
      // optional title for header chrome
      title: 'Impossible action'
    });
  }

}
