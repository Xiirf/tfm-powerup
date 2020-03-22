import { Component, OnInit } from '@angular/core';
import { TrelloService } from 'src/app/services/trello.service';
import { ConditionsService } from 'src/app/services/conditions.service';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})

export class CheckistComponent implements OnInit {

  idCard: string;
  nextTaskConditions = [];

  t = TrelloPowerUp.iframe({
    appKey: 'a956c8bac233d7840d394f901dc85d16',
    appName: 'Next_Task'
  });

  constructor(private trelloService: TrelloService, private conditionsService: ConditionsService) { }

  ngOnInit(): void {
    this.nextTaskConditions = [];
    this.t.getRestApi()
      .getToken()
      .then((token) => {
        this.t.card('all')
          .then((card) => {
            this.idCard = card.id;
            const idList = card.idList;
            // Récupération du board actuel
            this.t.board('all')
              .then((board) => {
                const idBoard = board.id;
                // On récupère les listes du board actuel
                this.trelloService.getAllListBoard(idBoard, token)
                  .then((data) => {
                    // On récupère l'index de la liste suivante (tâches suivante)
                    const index = data.findIndex(list => list.id === idList) + 1;
                    if (index < data.length) {
                      // On récupère les conditions dans la carte conditions
                      if (!localStorage.getItem('currentTaskId') || !(localStorage.getItem('currentTaskId') === idList)
                            || !localStorage.getItem('nextTaskConditions')) {
                        this.conditionsService.getCondition(data[0], token)
                        .then((conditions) => {
                          conditions.forEach(element => {
                            element.lastTask.forEach((id) => {
                              if (id === idList) {
                                element.conditions.forEach(e => {
                                  e.isChecked = false;
                                });
                                this.nextTaskConditions.push(element);
                              }
                            });
                          });
                          this.setTaskName(token);
                          this.setLocalStorage(idList);
                        });
                      } else {
                        this.nextTaskConditions = JSON.parse(localStorage.getItem('nextTaskConditions'));
                      }
                    } else {
                      localStorage.removeItem('nextTaskConditions');
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          });
      });
  }

  setTaskName(token: string) {
    this.nextTaskConditions.forEach(condition => {
      this.trelloService.getListInformation(condition.idTask, token)
        .then((list) => {
          condition.nameTask = list.name;
          localStorage.setItem('nextTaskConditions', JSON.stringify(this.nextTaskConditions));
        });
    });
  }

  onCheckboxChange(e, isChecked, id) {
    this.nextTaskConditions.forEach(item => {
      item.conditions.forEach(condition => {
        if (condition.idUnique === id) {
          this.isSameConditionAlreadySelected(condition.id, condition.idUnique)
          .then(_ => {
            condition.isChecked = !isChecked;
            localStorage.setItem('nextTaskConditions', JSON.stringify(this.nextTaskConditions));
          }).catch(() => {
            e.preventDefault();
            this.showModal('These are exclusive conditions you cannot choose two choices from the same condition.');
          });
        }
      });
    });
  }

  isSameConditionAlreadySelected(conditionId: string, conditionIdUnique: string) {
    return new Promise<any>( (resolve, reject) => {
      let error = false;
      this.nextTaskConditions.forEach(item => {
        item.conditions.forEach(condition => {
          if (condition.id === conditionId && condition.idUnique !== conditionIdUnique && condition.isChecked) {
            error = true;
          }
        });
      });
      error ? reject() : resolve();
    });
  }

  showModal(msg: string) {
    this.t.modal({
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

  setLocalStorage(idList) {
    localStorage.setItem('currentTaskId', idList);
    localStorage.setItem('nextTaskConditions', JSON.stringify(this.nextTaskConditions));
  }
}
