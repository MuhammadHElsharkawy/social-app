import { Routes } from "@angular/router";
import { GeneralTabComponent } from "./components/general-tab/general-tab.component";
import { SecurityTabComponent } from "./components/security-tab/security-tab.component";

export const routes: Routes = [
    {path: '', component: GeneralTabComponent},
    {path: 'security', component: SecurityTabComponent}
]