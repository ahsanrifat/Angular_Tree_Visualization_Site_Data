import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
