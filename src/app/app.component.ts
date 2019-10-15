import {Component, DoCheck, Inject, KeyValueDiffer, KeyValueDiffers, NgZone} from '@angular/core';
import {DataService} from './service/data.service';
import {ProgressModel} from './model/user/progress.model';
import {DebounceUtils} from './utils/debounce.utils';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from './model/game/room.model';
import {GameModel} from './model/game/game.model';
import {ModalService} from './service/modal.service';
import {FeedbackComponent} from './components/modal/feedback/feedback.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck {
  public progressAvailable = false;
  public progress: ProgressModel;
  public game: GameModel;
  public currentRoom: RoomModel;

  private readonly differ: KeyValueDiffer<string, string>;

  private debounceCheckForSave: (...args: any[]) => void;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(NgZone) private readonly ngZone: NgZone,
              @Inject(KeyValueDiffers) readonly differs: KeyValueDiffers,
              @Inject(HttpClient) private readonly http: HttpClient,
              private modalService: ModalService) {
    this.differ = differs.find([]).create();

    this.dataService.game$.subscribe(game => {
      this.game = game;
    });

    this.dataService.activeRoom$.subscribe(activeRoom =>  {
      this.currentRoom = activeRoom;
    });

    this.dataService.progress$.subscribe(progress => {
      this.progressAvailable = !!progress;
      this.progress = progress;
    });

    /* http backend test */
    // this.http.post('/api/write', '').subscribe(() => {
    //   console.log('works');
    // });

  }

  openDialog() {
    this.modalService.openDialog(FeedbackComponent, true);
  }

  public leaveActiveRoom(): void {
    this.dataService.leaveActiveRoom();
  }

  public ngDoCheck() {
    this.ngZone.runOutsideAngular(() => {
      this.checkForSave();
    });
  }

  private checkForSave(): void {
    if (!this.debounceCheckForSave) {
      this.debounceCheckForSave = DebounceUtils.debounce(() => {
        if (this.progressAvailable) {
          console.log('CHECK');
          const changes = this.differ.diff(this.getDiffObject());
          if (changes) {
            this.dataService.saveProgress(this.progress);
          }
        }
      }, 1000, false);
    }
    this.debounceCheckForSave();
  }

  private getDiffObject(): {} {
    return {object: JSON.stringify(this.progress)};
  }
}
