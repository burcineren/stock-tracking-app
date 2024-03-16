import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { StockTrackingComponent } from './stock-tracking.component';



const routes: Routes = [
  {
    path: '',
    component: StockTrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class DashboardAnalyticsRoutingModule {
}
