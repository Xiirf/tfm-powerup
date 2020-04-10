import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrelloService {
    root = 'https://api.trello.com/1';
    constructor(private http: HttpClient) { }

    getAllListBoard(idBoard: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey)
                                        .set('cards', 'closed');
        return this.http.get(`${this.root}/boards/${idBoard}/lists`, { params }).toPromise();
    }

    moveCard(idCard: string, idList: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey)
                                        .set('idList', idList);
        return this.http.put(`${this.root}/cards/${idCard}`, null, { params }).toPromise();
    }

    getComment(idCard: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey)
                                        .set('filter', 'commentCard');
        return this.http.get(`${this.root}/cards/${idCard}/actions`, { params }).toPromise();
    }

    deleteComment(idCard: string, idComment: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey);
        return this.http.get(`${this.root}/cards/${idCard}/actions/${idComment}/comments`, { params }).toPromise();
    }

    createComment(idCard: string, token: string, content: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey)
                                        .set('text', content);
        return this.http.post(`${this.root}/cards/${idCard}/actions/comments`, { params }).toPromise();
    }

    getListInformation(idList: string, token: string): Promise<any> {
        const params = new HttpParams().set('token', token)
                                        .set('key', environment.appKey);
        return this.http.get(`${this.root}/lists/${idList}`, { params }).toPromise();
    }
}
