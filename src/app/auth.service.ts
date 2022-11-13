import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userSubject = new ReplaySubject<firebase.User>();

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // Require login. This should be done with a router guard... hax.
    this.afAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigateByUrl("/login");
      }
      this.userSubject.next(user);
    });
  }

  login() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  getUser(): Observable<firebase.User> {
    return this.userSubject.asObservable();
  }
}
