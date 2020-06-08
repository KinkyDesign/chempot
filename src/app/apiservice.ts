import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()

export class ApiService {

  baseUrl = 'here will be the JackPot Api';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    //  Authorization: ,
  });

  constructor(
    private httpClient: HttpClient
  ) {}
  getSmiles() {
    return this.httpClient.get(this.baseUrl, {headers: this.headers});
  }
}
