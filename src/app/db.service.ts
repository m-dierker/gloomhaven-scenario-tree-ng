import { EventEmitter, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, ReplaySubject } from "rxjs";
import { first } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DbService {
  private partyIdSubj: ReplaySubject<string>;
  public onScenarioDataUpdate: EventEmitter<string> = new EventEmitter();

  constructor(private db: AngularFirestore, private auth: AuthService) {
    this.subscribeToScenarios();
  }

  public saveScenarios(scenarioJson: string) {
    this.getPartyId()
      .pipe(first())
      .subscribe((partyId) => {
        this.db
          .collection("parties")
          .doc(partyId)
          .collection("scenarios")
          .doc<ScenariosDoc>("scenarios")
          .set({
            scenarioJson,
          });
      });
  }

  private subscribeToScenarios() {
    this.getPartyId()
      .pipe(first())
      .subscribe((partyId) => {
        this.db
          .collection("parties")
          .doc(partyId)
          .collection("scenarios")
          .doc<ScenariosDoc>("scenarios")
          .valueChanges()
          .subscribe((scenarioDoc) => {
            this.onScenarioDataUpdate.emit(scenarioDoc.scenarioJson);
          });
      });
  }

  public getPartyId(): Observable<string> {
    if (this.partyIdSubj) {
      return this.partyIdSubj.asObservable();
    }
    this.partyIdSubj = new ReplaySubject(1);
    this.auth.getUser().subscribe((user) => {
      if (!user) {
        return;
      }
      this.db
        .collection("users")
        .doc<UserDoc>(user.uid)
        .valueChanges()
        .subscribe((userDoc) => {
          this.partyIdSubj.next(userDoc.party);
        });
    });
    return this.partyIdSubj.asObservable();
  }
}

export interface ScenariosDoc {
  scenarioJson: string;
}

export interface UserDoc {
  party: string;
}
