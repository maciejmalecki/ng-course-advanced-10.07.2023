import {Component, OnDestroy} from '@angular/core';
import {Book} from "../../model/book";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {BooksState} from "../../store/books.reducer";
import {deselectBookAction, saveBookAction} from "../../store/books.actions";
import {Observable, Subscription} from "rxjs";
import {BooksSelector} from "../../store/books.selectors";

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnDestroy {

  readonly book$: Observable<Book | null>;

  private selectedBook: Book | null = null;

  private selectedBookSubscription: Subscription;

  formGroup: FormGroup;
  titleFormControl: FormControl;
  authorFormControl: FormControl;
  descriptionFormControl: FormControl;

  constructor(private readonly store: Store<BooksState>) {
    this.titleFormControl = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]);
    this.authorFormControl = new FormControl('', [Validators.required]);
    this.descriptionFormControl = new FormControl('', [Validators.maxLength(500)]);
    this.formGroup = new FormGroup({
      id: new FormControl(),
      title: this.titleFormControl,
      author: this.authorFormControl,
      description: this.descriptionFormControl
    });
    this.book$ = this.store.pipe(select(BooksSelector.getSelectedBook));
    this.selectedBookSubscription = this.book$.subscribe(book => {
      this.selectedBook = book;
      if (this.selectedBook) {
        this.formGroup.setValue(this.selectedBook);
      } else {
        this.formGroup.reset();
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedBookSubscription.unsubscribe();
  }

  save(): void {
    if (this.selectedBook) {
      const book: Book = this.formGroup.value;
      this.store.dispatch(saveBookAction({book}));
      this.store.dispatch(deselectBookAction());
    }
  }

  cancel(): void {
    this.store.dispatch(deselectBookAction());
  }
}
