import { Component, Input, OnInit } from '@angular/core';
import { trackByValue } from '../../utils/track-by';

@Component({
  selector: 'vex-breadcrumbs',
  template: `
    <div class="flex justify-between">
     <div class="flex">
     <vex-breadcrumb>
        <a [routerLink]="['/']">
          <mat-icon svgIcon="mat:home" class="icon-sm"></mat-icon>
        </a>
      </vex-breadcrumb>
      <ng-container *ngFor="let crumb of crumbs; trackBy: trackByValue">
        <vex-breadcrumb class="mt-1"> 
          <a [routerLink]="[]" >{{ crumb }}</a>
        </vex-breadcrumb>
        
      </ng-container>
     </div>
      <div class="-mx-1 flex items-center justify-end">
          <div class="px-1">
            <button  mat-icon-button type="button">
              <mat-icon color="primary" svgIcon="mat:search"></mat-icon>
            </button>
          </div>

        <div class="px-1">
          <vex-toolbar-notifications></vex-toolbar-notifications>
        </div>

        <div class="px-1">
          <button  mat-icon-button type="button">
            <mat-icon color="primary" svgIcon="mat:bookmarks"></mat-icon>
          </button>
        </div>

        <div class="px-1">
          <button [matMenuTriggerFor]="languageMenu" mat-icon-button type="button">
            <mat-icon svgIcon="flag:united-states"></mat-icon>
          </button>
        </div>

        <mat-menu #languageMenu="matMenu" overlapTrigger="false" xPosition="before" yPosition="below">
          <button mat-menu-item>
            <mat-icon svgIcon="flag:united-states"></mat-icon>
            <span>English</span>
          </button>

          <button mat-menu-item>
            <mat-icon svgIcon="flag:germany"></mat-icon>
            <span>German</span>
          </button>
        </mat-menu>
      </div>
    </div>
  `
})
export class BreadcrumbsComponent implements OnInit {

  @Input() crumbs: string[] = [];

  trackByValue = trackByValue;

  constructor() {
  }

  ngOnInit() {
  }
}
