import { Component } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

interface Article {
  id: string;
  title: string;
  body: string;
  created: string;
  updated: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Articles page';
  articles: Article[] = [];
  searchInputValue: string = '';
  loading: boolean = false;

  ngAfterViewInit(): void {
    const searchInput = document.getElementById(
      'searchInput'
    ) as HTMLInputElement;

    const search$: Observable<string> = fromEvent(searchInput, 'input').pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      debounceTime(750),
      distinctUntilChanged()
    );

    search$
      .pipe(
        switchMap((keyword) => {
          this.loading = true; // Set loading to true when fetching articles
          return this.fetchArticles(keyword);
        })
      )
      .subscribe(
        (articles) => {
          this.articles = articles;
          this.loading = false; // Set loading to false when articles are fetched
        },
        (error) => {
          console.error('Error fetching articles:', error);
          this.loading = false; // Set loading to false on error
        }
      );
  }

  fetchArticles(keyword: string): Observable<Article[]> {
    // Simulating server delay with setTimeout
    return new Observable<Article[]>((observer) => {
      setTimeout(() => {
        const dummyData: Article[] = [
          {
            id: '1',
            title: 'JSON:API paints my bikeshed!',
            body: 'The shortest article. Ever.',
            created: '2015-05-22T14:56:29.000Z',
            updated: '2015-05-22T14:56:28.000Z',
          },
          {
            id: '2',
            title: 'RESTful days are gone!',
            body: 'The era of RESTful APIs has come to an end.',
            created: '2016-08-15T10:30:00.000Z',
            updated: '2016-08-15T10:30:00.000Z',
          },
          {
            id: '3',
            title: 'GraphQL: A Query Language for your API',
            body: 'Learn how GraphQL simplifies data fetching.',
            created: '2017-11-28T16:45:00.000Z',
            updated: '2017-11-28T16:45:00.000Z',
          },
          {
            id: '4',
            title: 'Microservices Architecture: Breaking the Monolith',
            body: 'Transitioning from monolithic to microservices architecture.',
            created: '2018-06-10T08:20:00.000Z',
            updated: '2018-06-10T08:20:00.000Z',
          },
        ];
        // Filter articles based on title matching the search term
        const filteredArticles = dummyData.filter((article) =>
          article.title.toLowerCase().includes(keyword.toLowerCase())
        );
        observer.next(filteredArticles);
        observer.complete();
      }, 750); // Simulating 1 second delay
    });
  }
}
