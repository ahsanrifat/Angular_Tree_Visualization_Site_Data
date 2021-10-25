import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TooltipModule } from 'ng2-tooltip-directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { D3GraphTextNodeComponent } from './d3-graph-text-node/d3-graph-text-node.component';
import { GraphRootComponent } from './graph-root/graph-root.component';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { ModalComponentComponent } from './modal-component/modal-component.component';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    D3GraphTextNodeComponent,
    ModalComponentComponent,
    GraphRootComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    TooltipModule,
    NgbModule,
    MatInputModule,
    MatExpansionModule,
    MatTableModule,
    MatGridListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD5xT4mLCRpIux2TnrodKNJll9LVME23SI',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
