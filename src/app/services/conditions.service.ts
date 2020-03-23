import { Injectable } from '@angular/core';
import { TrelloService } from './trello.service';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {
    constructor(private trelloService: TrelloService) { }

    getCondition(listStart, token: string) {
        return new Promise<any>( (resolve, reject) => {
          const idCardCondition = listStart.cards.find( elem => elem.name === 'Conditions_Data_Storage').id;
          return this.trelloService.getComment(idCardCondition, token)
            .then((comments) => {
              const conditions = this.clearCommentObject(comments);
              resolve(conditions);
            })
            .catch((error) => {
              reject(error);
            });
        });
    }

    clearCommentObject(comments) {
        // Delete all \
        let conditions = JSON.stringify(comments[0].data.text).replace(/\\/g, '');
        // Delete first "
        const firstIndex = conditions.indexOf('"');
        conditions = conditions.substring(firstIndex + 1);
        // Delete last "
        const lastIndex = conditions.lastIndexOf('"');
        conditions = conditions.substring(0, lastIndex);
        return JSON.parse(conditions);
    }
}
