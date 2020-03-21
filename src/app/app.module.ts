import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { TrelloService } from './services/trello.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CheckistComponent } from './components/checklist/checklist.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorizeComponent,
    CheckistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [TrelloService],
  bootstrap: [AppComponent]
})
export class AppModule { }
