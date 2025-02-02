import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  ExportTreeComponent,
  ImportExportDialogComponent,
} from "./export-tree/export-tree.component";
import { MaterialModule } from "./material.module";
import { AppComponent } from "./app.component";
import { TreeComponent } from "./tree/tree.component";
import { AssetService } from "./asset.service";
import {
  ScenarioInfoComponent,
  ScenarioInfoDialogComponent,
} from "./scenario-info/scenario-info.component";
import { TreeLogicService } from "./tree-logic.service";
import { KeyComponent } from "./key/key.component";
import { environment } from "environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TreeComponent,
    ScenarioInfoComponent,
    ScenarioInfoDialogComponent,
    ExportTreeComponent,
    ImportExportDialogComponent,
    KeyComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
  ],
  providers: [AssetService, TreeLogicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
