import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private http: HttpClient) { }
  test_api() {
    const tree_data = this.http.get("http://127.0.0.1:8000/api/get_tree")

    return tree_data;
  }

}
