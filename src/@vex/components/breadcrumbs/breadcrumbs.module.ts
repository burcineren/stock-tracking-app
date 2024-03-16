import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MatMenuModule } from '@angular/material/menu';
import { ToolbarNotificationsModule } from 'src/@vex/layout/toolbar/toolbar-notifications/toolbar-notifications.module';
import { ToolbarSearchModule } from 'src/@vex/layout/toolbar/toolbar-search/toolbar-search.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,    
    MatMenuModule,
    ToolbarNotificationsModule,
    ToolbarSearchModule
  ],
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  exports: [BreadcrumbsComponent]
})
export class BreadcrumbsModule {
}
