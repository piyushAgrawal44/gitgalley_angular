import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FetchRepoService {

  constructor(private http: HttpClient) { }

  // auth token github


  fetchRepo(username: string, perPage: number, page: number, query: string): Observable<any> {
    // this service fetch all repos for a given query name and username
    // username is the user under which we have to find the repo containing query

    // github auth token
    const headers = new HttpHeaders({
      'Authorization': `token ${environment.github_token ?? ""}`
    });

    // check the environment if it is production then use auth token other wise fetch data with auth toke.
    // this way it will work if you do not set env correctly
    if (environment.production === true) {
      if (!query) {
        return this.http.get(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`, { headers });
      }
      else {
        return this.http.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${username}&per_page=${perPage}&page=${page}`, { headers });
      }
    }
    else {
      if (!query) {
        return this.http.get(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`);
      }
      else {
        return this.http.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${username}&per_page=${perPage}&page=${page}`);
      }
    }

  }

  totalRepo(username: string, query: string): Observable<any> {
    // this service fetch total repos count for given repo query

    // if query is blank then https://api.github.com/search/repositories?q this api will give error so I am using `https://api.github.com/users/${username}/repos for blank query
    // but https://api.github.com/users/${username}/repos this also return max 30 items at a time so I have not called this service for fetching total repo for a blank query
    // instead I have used total public repo count fetched from fetchUserDetails service (https://api.github.com/users/${username})


    // github auth token
    const headers = new HttpHeaders({
      'Authorization': `token ${environment.github_token ?? ""}`
    });

    // check the environment if it is production then use auth token other wise fetch data with auth toke.
    // this way it will work if you do not set env correctly
    if (environment.production === true) {
      if (!query) {
        return this.http.get(`https://api.github.com/users/${username}/repos`, { headers });
      }
      else {
        return this.http.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${username}`, { headers });

      }
    }
    else {
      if (!query) {
        return this.http.get(`https://api.github.com/users/${username}/repos`);
      }
      else {
        return this.http.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${username}`);

      }
    }

  }


  fetchUserDetails(username: string,): Observable<any> {
    // this service fetch user details for a correct username
    // if username is not valid then it give 404 error

    // github auth token
    const headers = new HttpHeaders({
      'Authorization': `token ${environment.github_token ?? ""}`
    });

    // check the environment if it is production then use auth token other wise fetch data with auth toke.
    // this way it will work if you do not set env correctly
    if (environment.production === true) {
      return this.http.get(`https://api.github.com/users/${username}`, { headers });
    }
    else {
      return this.http.get(`https://api.github.com/users/${username}`);
    }
  }
}
