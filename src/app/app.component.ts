import { Component } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

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
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testAng';
  articles: Article[] = [];
  searchInputValue: string = '';

  ngAfterViewInit(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    const search$: Observable<string> = fromEvent(searchInput, 'input').pipe(
      map((event: Event) => (event.target as HTMLInputElement).value),
      debounceTime(750),
      distinctUntilChanged()
    );

    search$.pipe(
      switchMap(keyword => this.fetchArticles(keyword))
    ).subscribe(
      articles => this.articles = articles,
      error => console.error('Error fetching articles:', error)
    );
  }

  fetchArticles(keyword: string): Observable<Article[]> {
    // Simulating server delay with setTimeout
    return new Observable<Article[]>(observer => {
      setTimeout(() => {
        const dummyData: Article[] = [
          {
            id: '1',
            title: 'JSON:API paints my bikeshed!',
            body: 'The shortest article. Ever.',
            created: '2015-05-22T14:56:29.000Z',
            updated: '2015-05-22T14:56:28.000Z'
          }
        ];
        observer.next(dummyData);
        observer.complete();
      }, 1000); // Simulating 1 second delay
    });
  }
}
