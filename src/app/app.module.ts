import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from 'ng2-codemirror';
import 'codemirror';

import { AppComponent } from './app.component';
import { AppCodeMirrorComponent } from './app-code-mirror/app-code-mirror.component';

@NgModule({
  declarations: [
    AppComponent,
    AppCodeMirrorComponent
  ],
  imports: [
    BrowserModule,
    CodemirrorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
