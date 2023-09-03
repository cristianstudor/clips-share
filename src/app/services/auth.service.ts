import { Injectable } from '@angular/core';
import { Observable, map, delay, filter, switchMap, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection<IUser>('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        // Wait for the event with type NavigationEnd to be emitted
        filter((event) => event instanceof NavigationEnd),
        // Get the first child route from the activated route in <router-outlet>
        map((event) => this.route.firstChild),
        // Get the data observable from the route; limits the observables to one
        switchMap((route) => route?.data ?? of({ authOnly: false }))
      )
      .subscribe((data) => {
        this.redirect = data.authOnly ?? false;
      });
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

  public async logOut($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    await this.auth.signOut();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
