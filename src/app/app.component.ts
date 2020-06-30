import { Component, OnInit } from '@angular/core';
import { TrelloService } from './services/trello.service';
import { environment } from 'src/environments/environment';
import { CheckConditionService } from './services/checkCondition.service';
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

  constructor(private trelloService: TrelloService,
              private checkConditionService: CheckConditionService) {}

  ngOnInit() {
    this.trelloInit();
  }

  // Trello function calling all capacities
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
                title: 'Conditions',
                icon: this.NEXT_TASK, // Must be a gray icon, colored icons not allowed.
                content: {
                  type: 'iframe',
                  url: t.signUrl('./condition'),
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

  // Frame to the auth
  showIframeAuth(t) {
    return t.popup({
      title: 'Authorize to continue',
      url: '/authorize'
    });
  }

  // Method to move the card after a click on "NextTask"
  showIframeNext(t, token) {
    // Récupération de la carte actuelle
    return t.card('all')
      .then((card) => {
        const idCard = card.id;
        // Récupération du board actuel
        this.getNextTask(idCard, token)
        .then((newListId) => {
          this.trelloService.moveCard(idCard, newListId, token)
            .then((resp) => {
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

  async getNextTask(idCard: string, token: string) {
    return new Promise<any>( async (resolve, reject) => {
      let isPermissionOk = true;
      // Check if they are user assigned to this task and if actual user is one of them
      const cardMembersId = await this.trelloService.getCardMembersId(idCard, token);
      if (cardMembersId.idMembers.length > 0) {
        const idCurrentMember = await this.trelloService.getMemberIdByToken(token);
        if (!cardMembersId.idMembers.includes(idCurrentMember.idMember)) {
          isPermissionOk = false;
        }
      }

      if (isPermissionOk) {
        // get all possible nextTask
        const nextTask = JSON.parse(localStorage.getItem('nextTask'));
        // Get condition and next tasks
        const conditions = JSON.parse(localStorage.getItem('nextTaskConditions'));
        // Get user Data
        const userData = JSON.parse(localStorage.getItem('userData')).find(data => data.idCard === idCard);
        // Get form for the current task
        const formCurrentTask = JSON.parse(localStorage.getItem('formCurrentTask'));
        // Check if the form is completed
        if (userData && formCurrentTask) {
          formCurrentTask.forEach(form => {
            if (!(userData.data.find(variable => variable.nameVar === form.nameVar))) {
              reject('¡ Debe llenar el formulario !');
            }
          });
        }
        let nextElement;
        // In this case we dont have conditions
        if (!conditions || conditions.length === 0) {
          // Check if we have a next task, in this case we can only have one task
          if (nextTask) {
            resolve(nextTask[0]);
          } else {
            // No more task
            reject(null);
          }
        } else if (userData) {
          // In this case we have conditions
          // All destination are in nextTask
          // Check for each destination if one have all conditions completed
          for (const dest of nextTask) {
            let conditionRespected = true;
            // Get all condition for the tested destination
            const conditionsNextTask = conditions.filter(element => element.destination === dest);
            // Loop on all condition of the tested destination
            for (const element of conditionsNextTask) {
              // Check if the current user have completed the condition variable
              if (userData.data.find(data => data.nameVar === element.choice.nameVar)) {
                const value = userData.data.find(data => data.nameVar === element.choice.nameVar).value;
                // If this return false one time so we cant go to the this destination
                const temp = await this.checkConditionService.checkCondition(element, value);
                if (!temp) {
                  conditionRespected = false;
                }
              } else {
                conditionRespected = false;
              }
            }
            if (conditionRespected) {
              nextElement = dest;
            }
          }
          // Send the destination
          if (nextElement) {
            resolve(nextElement);
          }
        }
        reject('¡Tienes que terminar algún prerrequisito para tener una próxima tarea!');
      } else {
        reject('Alguien está asignado a esta tarea, sólo esta persona puede ir a la siguiente tarea');
      }
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
