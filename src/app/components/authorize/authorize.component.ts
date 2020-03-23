import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
declare let TrelloPowerUp: any;

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})

export class AuthorizeComponent {
    t = TrelloPowerUp.iframe({
        appKey: environment.appKey,
        appName: environment.appName
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
