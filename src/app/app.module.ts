import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxMoveableModule } from 'ngx-moveable';
import { AppComponent } from './app.component';
import { NgxGuidelinesComponent } from '../ngx-guidelines/ngx-guidelines.component';
import { NgxGuidelinesModule } from '../ngx-guidelines/ngx-guidelines.module';
import { HelloComponent } from './hello.component';

@NgModule({
  declarations: [AppComponent, NgxGuidelinesComponent, HelloComponent],
  imports: [BrowserModule, NgxMoveableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
