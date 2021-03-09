import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    baseUrl = 'https://foodforlife.com.ua/api/v1/get_search';
    queryUrl = '?search=';

    constructor(private http: HttpClient) {}

    search(terms: Observable<string>): any {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term: string) => this.searchEntries(term))
        );
    }

    // searchEntries(term): makes a get request to our API endpoint with our search term, this gives us another observable
    searchEntries(term: string): Observable<object> {
        if (term === '') {
            return of({});
        }
        // Create the request url with search term in the query params
        const url = `${this.baseUrl}${this.queryUrl}${term}`;
        return this.http.get(url);
    }
}
