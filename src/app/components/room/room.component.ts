import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {RoomModel} from '../../model/game/room.model';
import {FeedbackComponent} from '../modal/feedback/feedback.component';
import {DataService} from '../../service/data.service';
import {ModalService} from '../../service/modal.service';
import {QuestionModel} from '../../model/game/question.model';
import {QuizfrageComponent} from '../base/quizfrage/quizfrage.component';
import {InfotextComponent, InfotextData} from '../base/infotext/infotext.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() public room: RoomModel;
  @Output() private onClose: EventEmitter<void> = new EventEmitter();

  public optionalQuestions: number[];
  private mandatoryQuestionWasAnsweredOnEntry: boolean;

  constructor(@Inject(DataService) private readonly dataService: DataService,
              @Inject(ModalService) private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.optionalQuestions = [];
    for (let i = 1; i < this.room.questions.length; i++) {
      this.optionalQuestions.push(i);
    }

    this.mandatoryQuestionWasAnsweredOnEntry = this.room.questions[0].answered;
  }

  public closeRoom(): void {
    if (!this.room.feedback && !this.mandatoryQuestionWasAnsweredOnEntry && this.room.questions[0].answered) {
      this.modalService.openDialog(FeedbackComponent, true).subscribe(() => this.onClose.emit());
    } else {
      this.onClose.emit();
    }

  }

  public openQuestion(question: QuestionModel): void {
    this.dataService.selectQuestion(question);
    this.modalService.openDialog(QuizfrageComponent, false).subscribe(() => {
      this.dataService.unselectQuesion();
    });
  }

  public openInfoModal(): void {
    const text: InfotextData = {
      text: '"Lorem Ipsum Dolor Sit anem!" schrie Dumbledore durch den Wald.' +
        ' Die Affen jedoch reagierten kaum und so konnte Mittelerde vom Terminator ' +
        'verschohnt werden. Im Hintergrund hört man Dumbo sagen: "Möge die Macht mit dir sein"'
    };
    this.modalService.openDialog(InfotextComponent, false, text)
      .subscribe(() => console.log('closed'));
  }

}
