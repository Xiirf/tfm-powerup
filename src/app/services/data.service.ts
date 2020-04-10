import { Injectable } from '@angular/core';
import { TrelloService } from './trello.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    constructor(private trelloService: TrelloService) { }

    getData(listStart, token: string, nameCard) {
        return new Promise<any>( (resolve, reject) => {
          const idCardData = listStart.cards.find( elem => elem.name === nameCard).id;
          return this.trelloService.getComment(idCardData, token)
            .then((comments) => {
              const conditions = this.clearCommentObject(comments);
              resolve(conditions);
            })
            .catch((error) => {
              reject(error);
            });
        });
    }

    setData(listStart, token: string, nameCard, content: string) {
      return new Promise<any>( (resolve, reject) => {
        const idCardData = listStart.cards.find( elem => elem.name === nameCard).id;
        return this.trelloService.getComment(idCardData, token)
          .then((comments) => {
            comments.foreach(async comment => {
              await this.trelloService.deleteComment(idCardData, comment.id, token);
            });
            this.trelloService.createComment(idCardData, token, content);
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
