import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {QuizRoomComponent} from './components/quiz-room/quiz-room.component';
import {FormsModule} from '@angular/forms';
import {MapComponent} from './components/map/map.component';
import {RoomComponent} from './components/room/room.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {OverlayCardComponent} from './components/base/overlay-card/overlay-card.component';
import {ButtonComponent} from './components/base/button/button.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RoomComponent,
    QuizRoomComponent,
    OverlayCardComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularSvgIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
