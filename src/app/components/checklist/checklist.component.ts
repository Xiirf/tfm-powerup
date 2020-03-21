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
                      this.conditionsService.getCondition(data[0], token)
                        .then((conditions) => {
                          conditions.forEach(element => {
                            element.lastTask.forEach((id) => {
                              if ((id === idList)) {
                                this.nextTaskConditions.push(element);
                              }
                            });
                          });
                          this.setTaskName(token);
                        });
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
        });
    });
  }

  onCheckboxChange(condition: [], e) {
    console.log(JSON.stringify(e));
  }
}
