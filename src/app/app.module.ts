import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgxGraphFdComponent } from './ngx-graph-fd/ngx-graph-fd.component';
import { NgxGraphNormalComponent } from './ngx-graph-normal/ngx-graph-normal.component';
import { D3GraphBubbleComponent } from './d3-graph-bubble/d3-graph-bubble.component';
import { D3GraphTextNodeComponent } from './d3-graph-text-node/d3-graph-text-node.component';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OptionalGraphComponent } from './optional-graph/optional-graph.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NgxGraphFdComponent,
    NgxGraphNormalComponent,
    D3GraphBubbleComponent,
    D3GraphTextNodeComponent,
    ModalComponentComponent,
    OptionalGraphComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    TooltipModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
