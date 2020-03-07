import { Component } from '@angular/core';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})

export class AuthorizeComponent {
    t = TrelloPowerUp.iframe({
        appKey: 'a956c8bac233d7840d394f901dc85d16',
        appName: 'Next_Task'
    });

    authorize() {
        this.t.getRestApi()
        .authorize({ scope: 'read,write'})
        .then(() => {
            alert('Success!');
            // this.t.closePopup(); // A test
        })
        .catch(TrelloPowerUp.restApiError.AuthDeniedError, () => {
            alert('Cancelled!');
        });
    }
}
