import {Component} from '@angular/core';
import {Book} from "../../model/book";
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {BooksState} from "../../store/books.reducer";
import {BooksSelector} from "../../store/books.selectors";
import {loadBooksAction, selectBookAction} from "../../store/books.actions";

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  readonly selectedBook$: Observable<Book | null>;
  readonly books$: Observable<Book[]>;

  constructor(private readonly store: Store<BooksState>) {
    this.books$ = this.store.pipe(select(BooksSelector.getBooks));
    this.selectedBook$ = this.store.pipe(select(BooksSelector.getSelectedBook));
    this.store.dispatch(loadBooksAction());
  }

  selectBook(book: Book): void {
    this.store.dispatch(selectBookAction({book}));
  }
}
