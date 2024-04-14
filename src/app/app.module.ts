import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule } from '@angular/common/http';
import { CustomLayoutModule } from './layout/custom-layout.module';
import { StockState } from './store/stock/filter.state';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([StockState]),
    VexModule,
    CustomLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
