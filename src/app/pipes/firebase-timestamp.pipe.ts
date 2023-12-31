import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'firebaseTimestamp',
})
export class FirebaseTimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue | undefined) {
    if (!value) return '';

    const date = (value as firebase.firestore.Timestamp).toDate();

    return this.datePipe.transform(date, "dd.MM.yy 'at' HH:mm");
  }
}
