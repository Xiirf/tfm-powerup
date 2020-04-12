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

    setData(listStart, token: string, nameCard, content) {
      console.log("IN Methode setData");
      return new Promise<any>( (resolve, reject) => {
        const idCardData = listStart.cards.find( elem => elem.name === nameCard).id;
        return this.trelloService.getComment(idCardData, token)
          .then((comments) => {
            let userData = [];
            if (comments.length > 0) {
              console.log('IN');
              console.log(comments);
              userData = this.clearCommentObject(comments[0].data.text);
            }
            comments.forEach(async comment => {
              await this.trelloService.deleteComment(idCardData, comment.id, token);
            });
            content = this.clearCommentObject(content)[0];
            if (userData.length > 0 && userData.find(data => data.idCard === content.idCard)) {
              userData.find(data => data.idCard === content.idCard).data = content.data;
            } else {
              userData.push({
                idCard: content.idCard,
                data: content.data
              });
            }
            // const contentData = this.clearCommentObject(JSON.stringify(userData));
            // console.log("DATA");
            // console.log(contentData);
            this.trelloService.createComment(idCardData, token, JSON.stringify(userData))
            .then(_ => {
              resolve();
            });
          })
          .catch((error) => {
            reject(error);
          });
      });
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
