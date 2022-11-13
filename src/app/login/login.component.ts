import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private user$: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.getUser().subscribe((user) => {
      if (user) {
        // Non-Angular Callback.
        this.zone.run(() => {
          this.router.navigateByUrl("/");
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.user$) {
      this.user$.unsubscribe();
    }
  }

  login() {
    this.auth.login();
  }
}
