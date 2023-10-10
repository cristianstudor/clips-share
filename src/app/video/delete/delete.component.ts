import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent implements OnInit, OnDestroy {
  @Input() clips: IClip[] = [];
  @Input() activeClip: IClip | null = null;
  @Output() updateClips = new EventEmitter();
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! Deleting clip.';

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('deleteClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('deleteClip');
  }

  async deleteClip($event: Event) {
    $event.preventDefault();

    if (!this.activeClip) return;

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! Deleting clip.';

    try {
      await this.clipService.deleteClip(this.activeClip);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Try again later.';
      return;
    }

    this.clips.forEach((element, index) => {
      if (!this.activeClip) return;

      if (element.docID == this.activeClip.docID) {
        this.clips.splice(index, 1);
      }
    });

    this.updateClips.emit(this.clips);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Clip deleted!';
  }
}
