import { Component, OnInit } from '@angular/core';
import { TrelloService } from './services/trello.service';
import { ConditionsService } from './services/conditions.service';
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

  constructor(private trelloService: TrelloService, private conditionsService: ConditionsService) {}

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
        appKey: 'a956c8bac233d7840d394f901dc85d16',
        appName: 'Next_Task'
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
        const idList = card.idList;
        // Récupération du board actuel
        t.board('all')
        .then((board) => {
          const idBoard = board.id;
          // On récupère les listes du board actuel
          this.trelloService.getAllListBoard(idBoard, token)
            .then((data) => {
              // On récupère l'index de la liste suivante (tâches suivante)
              const index = data.findIndex(list => list.id === idList) + 1;
              if (index < data.length) {
                // On récupère les conditions dans la carte conditions
                // this.getCondition(data[0], token, idList); Utiliser fonction en bas pour avancer et trouver tache
                // checkAndSetCondition(idCard, )
                const newListId = data[index].id;
                // Déplacement de la carte
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

  getCondition(listStart, token: string, currentListId: string) {
    // 1 // Recup condition
    // 2 // Regarder si les conditions requises sont effectuées
    // 3 // MAJ checklist (ajout nouvelle) (choix eclusif)
    return new Promise( (resolve, reject) => {
      // const conditions = this.conditionsService.getCondition(data[0], token);
      const idCardCondition = listStart.cards.find( elem => elem.name === 'Conditions_Data_Storage').id;
      return this.trelloService.getComment(idCardCondition, token)
        .then((comments) => {
          resolve();
          // Check conditions

          // MAJ checklist

          // Define next task
          /*let nextTask = [];
          conditions.forEach(element => {
            const index = element.lastTask.indexOf(currentListId);
            if (index !== -1) {
                // check condition
                // element.conditions.forEach()
                // si condition ok on ajoute dans nextTask
            }
          });*/

        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
