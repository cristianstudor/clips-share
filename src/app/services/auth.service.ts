import { Injectable } from '@angular/core';
import { Observable, map, delay } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import IUser from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection<IUser>('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error('Password not provided!');
    }
    const { email, password, name, age, phoneNumber } = userData;

    // Creates user and sends back token that is managed by Firebase SDK
    const userCred = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    // Check if the user was created
    if (!userCred.user) {
      throw new Error("User can't be found!");
    }
    // Create user document and add it to usersCollection
    await this.usersCollection.doc(userCred.user.uid).set({
      name: name,
      email: email,
      age: age,
      phoneNumber: phoneNumber,
    });
    // Updates user's profile
    await userCred.user.updateProfile({
      displayName: userData.name,
    });
  }
}
