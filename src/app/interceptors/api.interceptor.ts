import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataServiceService } from '../data-service.service';
import { finalize } from 'rxjs/operators';
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(public dataService: DataServiceService) {}
  private count = 0;
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.count === 0) {
      this.dataService.api_loading.next(true);
    }
    // gets incremented with the number of requests
    this.count++;
    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.dataService.api_loading.next(false);
        }
      })
    );
  }
}
