import { Component, OnInit } from "@angular/core";
import { AssetService } from "./asset.service";
import { TreeLogicService } from "./tree-logic.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "./auth.service";
import { DbService } from "./db.service";
import { isEqual } from "lodash";
import { ThrowStmt } from "@angular/compiler";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public scenarios: any;
  public selectedScenario: any = null;
  constructor(
    private assetService: AssetService,
    private treeLogicService: TreeLogicService,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private db: DbService
  ) {}
  ngOnInit() {
    this.assetService
      .getScenariosJSON()
      .subscribe((scenarios) => (this.scenarios = scenarios));
    this.db.onScenarioDataUpdate.subscribe((scenarioJson) => {
      console.log("Scenario JSON update: ", scenarioJson);
      this.handleScenariosJsonImport(scenarioJson);
    });
  }
  public handleScenarioSelect(scenario) {
    if (scenario) {
      const rawScenario =
        typeof scenario.data === "function" ? scenario.data() : scenario.data;
      rawScenario.activePage = rawScenario.pages[0];
      rawScenario.imageUrl = this.getImageUrl(rawScenario.activePage);
      this.selectedScenario = rawScenario;
      /* Call this in case user drags the scenario. This will save it even if they make no other changes */
      this.scenarios = this.treeLogicService.updateScenario(
        this.scenarios,
        this.selectedScenario
      );
      this.assetService.setScenariosJSON(this.scenarios);
    } else {
      this.selectedScenario = null;
    }
  }
  public getNextScenarioPage() {
    const pages = this.selectedScenario.pages;
    let activeIndex = pages.indexOf(this.selectedScenario.activePage);
    activeIndex++;
    if (activeIndex === pages.length) {
      activeIndex = 0;
    }
    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.getImageUrl(
      this.selectedScenario.activePage
    );
  }
  public handleScenarioUpdate(changedScenario) {
    this.scenarios = this.treeLogicService.updateScenario(
      this.scenarios,
      changedScenario
    );
    this.assetService.setScenariosJSON(this.scenarios);
    this.handleScenarioSelect(
      this.scenarios.nodes.find(
        (scenario) => scenario.data.id === changedScenario.id
      )
    );
  }
  public handleScenariosImport(scenarios) {
    scenarios.edges = this.scenarios.edges;
    this.scenarios = scenarios;
    this.assetService.setScenariosJSON(this.scenarios);
    this.snackBar.open("Scenarios Imported!", "", {
      duration: 1500,
    });
  }
  public handleScenariosJsonImport(scenarioJson: string) {
    // Only proceed if there was a change since this is called too often.
    const parsedNewJson = JSON.parse(scenarioJson);
    const oldJson = JSON.parse(
      this.assetService.getEncodedScenarios(this.scenarios)
    );
    if (isEqual(parsedNewJson, oldJson)) {
      // Drop update due to equality.
      return;
    }

    const scenarios: any = this.assetService.getDecodedScenarios(
      this.scenarios.nodes,
      scenarioJson
    );
    scenarios.edges = this.scenarios.edges;
    this.scenarios = scenarios;
    // this.assetService.setScenariosJSON(this.scenarios);
    this.snackBar.open("Scenarios Imported!", "", {
      duration: 1500,
    });
  }
  private getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
