import { Injectable } from '@angular/core';
import { TrelloService } from './trello.service';
import { environment } from 'src/environments/environment';

declare let TrelloPowerUp: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  t = TrelloPowerUp.iframe({
    appKey: environment.appKey,
    appName: environment.appName
  });

  constructor(private trelloService: TrelloService) { }

  getDataCondition(listStart, token: string) {
    const nameCard = 'Conditions_Data_Storage';
    return new Promise<any>( (resolve, reject) => {
      const idCardData = listStart.cards.find( elem => elem.name === nameCard).id;
      return this.trelloService.getComment(idCardData, token)
        .then((comments) => {
          let conditions = [];
          if (comments.length !== 0) {
            conditions = this.clearCommentObject(comments[0].data.text);
          }
          resolve(conditions);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDataUser(idCard: string) {
    return new Promise<any>( (resolve, reject) => {
      this.t.get(idCard, 'shared', 'userData')
      .then((data) => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  setData(idCard: string, content) {
    return this.t.set(idCard, 'shared', 'userData', content);
  }

  clearCommentObject(comments) {
      // Delete all \
      let conditions = JSON.stringify(comments).replace(/\\/g, '');
      // Delete first "
      const firstIndex = conditions.indexOf('"');
      conditions = conditions.substring(firstIndex + 1);
        // Delete last "
      const lastIndex = conditions.lastIndexOf('"');
      conditions = conditions.substring(0, lastIndex);

      return JSON.parse(conditions);
  }
}
