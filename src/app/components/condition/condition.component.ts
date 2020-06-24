import { Component, OnInit } from '@angular/core';
import { TrelloService } from 'src/app/services/trello.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CheckConditionService } from 'src/app/services/checkCondition.service';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})

export class ConditionComponent implements OnInit {

  idCard: string;
  firstList: any;
  token: string;
  // Contain all conditions
  nextTaskConditions = [];
  // Current form
  formCurrentTask = [];
  // Data already completed
  dataToDisplay = [];
  // Data to complete
  formToComplete = [];
  // ID des persnnes à assigner
  taskAssign: string;

  userData = [];
  nextCondition: {
    name: string,
    choice: {
      nameVar: string,
      value: string,
      type: string,
      operator: string
    },
    id: string,
    idUnique: string,
    posCondition: number
  }; // Define Model
  conditionForm: FormGroup;
  // Formulaire pour les variables a set de userTask
  initVarForm: FormGroup;
  // Variable to check before display data to avoid error
  isInitVarFormCreated = false;

  t = TrelloPowerUp.iframe({
    appKey: environment.appKey,
    appName: environment.appName
  });

  constructor(private trelloService: TrelloService,
              private dataService: DataService,
              private fb: FormBuilder,
              private checkConditionService: CheckConditionService) {
    this.createForm();
  }

  createForm(): void {
    this.conditionForm = this.fb.group({
      dataValue: ['', [Validators.required]]
    });
    this.initVarForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.nextTaskConditions = [];
    this.t.getRestApi()
      .getToken()
      .then((token) => {
        this.token = token;
        this.t.card('all')
          .then((card) => {
            this.idCard = card.id;
            const idList = card.idList;
            // Get current bord
            this.t.board('all')
              .then((board) => {
                const idBoard = board.id;
                // Get all lists in the current board
                this.trelloService.getAllListBoard(idBoard, this.token)
                  .then(async (data) => {
                    this.firstList = data[0];
                    // Get index of the next list, it help to see if we are at the end or no
                    const index = data.findIndex(list => list.id === idList) + 1;
                    if (index <= data.length) {
                      // Get conditions from Conditions_Data_Storage Card if localhost is not set
                      if (!localStorage.getItem('currentTaskId') || !(localStorage.getItem('currentTaskId') === idList)
                            || !localStorage.getItem('nextTaskConditions') || !localStorage.getItem('formCurrentTask')
                            || !localStorage.getItem('assignTask') || !localStorage.getItem('nextTask')) {
                        this.taskAssign = '';
                        // Delete last next task information
                        localStorage.removeItem('nextTask');
                        // Get all condition from the card comment
                        await this.dataService.getDataCondition(this.firstList, this.token)
                        .then((conditions) => {
                          conditions.forEach(element => {
                            if (element.idTask === idList) {
                              // Get nextTask + their condition
                              element.conditions.forEach(cond => {
                                this.nextTaskConditions.push(cond);
                              });
                              // If there is no condition then we only have one nextTask
                              // only if we are not in the last task
                              if (element.nextTask.length > 0) {
                                localStorage.setItem('nextTask', JSON.stringify(element.nextTask));
                              }
                              // Get form for the current task
                              element.forms.forEach(form => {
                                this.formCurrentTask.push(form);
                              });
                              // Get assigned person
                              element.assigned.forEach(id => {
                                if (this.taskAssign === '') {
                                  this.taskAssign += id;
                                } else {
                                  this.taskAssign += ',' + id;
                                }
                              });
                            }
                          });
                          // Set localStorage with the new tasks
                          this.setLocalStorage(idList, 'Condition');
                        });
                        await this.trelloService.updateCardMember(this.idCard, this.taskAssign, this.token)
                          .then(resp => {
                          })
                          .catch(err => {
                            console.log(err);
                          });
                      } else {
                        this.nextTaskConditions = JSON.parse(localStorage.getItem('nextTaskConditions'));
                        this.formCurrentTask = JSON.parse(localStorage.getItem('formCurrentTask'));
                        this.taskAssign = localStorage.getItem('assignTask');
                      }
                    } else {
                      localStorage.removeItem('nextTaskConditions');
                    }
                    // If localstorage not set get userData from User_Data_Storage card
                    if (!localStorage.getItem('currentCardId') || !(localStorage.getItem('currentCardId') === this.idCard)
                            || !localStorage.getItem('userData')) {
                      await this.dataService.getDataUser(this.idCard)
                      .then((dataUser) => {
                        if (dataUser) {
                          dataUser.forEach(element => {
                            if (element.idCard === this.idCard) {
                              this.userData.push(element);
                            }
                          });
                        }
                        this.setLocalStorage(this.idCard, 'UserData');
                      });
                    } else {
                      this.userData = JSON.parse(localStorage.getItem('userData'));
                    }
                    this.getNextCondition();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          });
      });
  }

  // Get nextCondition to display
  async getNextCondition() {
    // Use an other var insteed of formCurrentTask to dont have template error (template is init before formCurrentTask value)
    this.formToComplete = [];
    this.dataToDisplay = [];
    // First we check all variable already set by the currentUser
    const tabVar = [];
    let allFormCompleted = true;
    // let commonValue = false;
    this.nextCondition = null;
    if (this.userData.find(data => data.idCard === this.idCard)) {
      this.userData.find(data => data.idCard === this.idCard).data.forEach(data => {
        tabVar.push(data);
      });
    }
    let tempVarAllFormCompleted = 0;
    tabVar.forEach(variable => {
      if ((this.formCurrentTask.find(form => form.nameVar === variable.nameVar))) {
        this.formCurrentTask.find(form => form.nameVar === variable.nameVar).valueActualUser = variable.value;
        tempVarAllFormCompleted++;
      } else {
        this.dataToDisplay.push(variable);
      }
    });
    this.formToComplete = Object.assign([], this.formCurrentTask);
    // Check if all var are completed from the actual list form
    if (this.formCurrentTask.length > tempVarAllFormCompleted) {
      allFormCompleted = false;
    }
    this.setInitVarForm();
  }

  async saveData() {
    let isPermissionOk = true;
    // Check if they are user assigned to this task and if actual user is one of them
    const cardMembersId = await this.trelloService.getCardMembersId(this.idCard, this.token);
    if (cardMembersId.idMembers.length > 0) {
      const idCurrentMember = await this.trelloService.getMemberIdByToken(this.token);
      if (!cardMembersId.idMembers.includes(idCurrentMember.idMember)) {
        isPermissionOk = false;
      }
    }

    if (isPermissionOk) {
      // Get all data needed from form and nextCondition
      const dataVar = [];
      if (this.nextCondition) {
        dataVar.push({
          nameVar: this.nextCondition.choice.nameVar,
          value: this.conditionForm.get('dataValue').value
        });
      } else {
        // Save form value
        for (const form of this.formToComplete) {
          dataVar.push({
            nameVar: form.nameVar,
            value: this.initVarForm.get(form.nameVar).value
          });
        }
      }

      // Push data in the userData
      // Chech if user already have data
      if (!this.userData.find(data => data.idCard === this.idCard)) {
        this.userData.push({
          idCard: this.idCard,
          data: dataVar
        });
      } else {
        dataVar.forEach(dataV => {
          // care about getting 2 value for the same var
          if (this.userData.find(data => data.idCard === this.idCard).data.find(dataSaved => dataSaved.nameVar === dataV.nameVar)) {
            this.userData.find(data => data.idCard === this.idCard).data
              .find(dataSaved => dataSaved.nameVar === dataV.nameVar).value = dataV.value;
          } else {
            this.userData.find(data => data.idCard === this.idCard).data.push(dataV);
          }
        });
      }
      // Add them in the local storage
      localStorage.setItem('userData', JSON.stringify(this.userData));
      // Add them in the card User_Data_Storage
      this.dataService.setData(this.idCard, this.userData);
      this.getNextCondition();
    } else {
      this.showModal('Alguien está asignado a esta tarea, sólo esta persona puede rellenar los datos.', this.t);
    }
  }

  setLocalStorage(id: string, object: string) {
    if (object === 'Condition') {
      localStorage.setItem('currentTaskId', id);
      localStorage.setItem('nextTaskConditions', JSON.stringify(this.nextTaskConditions));
      localStorage.setItem('formCurrentTask', JSON.stringify(this.formCurrentTask));
      localStorage.setItem('assignTask', this.taskAssign);
    } else if (object === 'UserData') {
      localStorage.setItem('currentCardId', id);
      localStorage.setItem('userData', JSON.stringify(this.userData));
    }
  }

  setInitVarForm() {
    this.initVarForm = this.fb.group({});
    this.formToComplete.forEach(form => {
      this.initVarForm.addControl(form.nameVar, new FormControl(form.valueActualUser, Validators.required));
    });
    this.isInitVarFormCreated = true;
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
      // optional title for header chrome
      title: 'Impossible action'
    });
  }

  // Method to disable form valid button
  isValueChanged() {
    let isValueChanged = false;
    this.formToComplete.forEach(form => {
      if (this.initVarForm.get(form.nameVar).value !== form.valueActualUser) {
        isValueChanged = true;
      }
    });
    return isValueChanged;
  }
}
