import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "../shared/material.module";
import {BookListComponent} from './components/book-list/book-list.component';
import {BooksService} from "./services/books.service";
import {BookDetailsComponent} from './components/book-details/book-details.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {StoreModule} from "@ngrx/store";
import {BOOKS_FEATURE, booksStateReducer} from "./store/books.reducer";
import {EffectsModule} from "@ngrx/effects";
import {BooksEffects} from "./store/books.effects";
import {WidgetsModule} from "../../../../widgets/src/lib/widgets.module";

@NgModule({
  declarations: [
    BookListComponent,
    BookDetailsComponent
  ],
  exports: [
    BookListComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    WidgetsModule,
    StoreModule.forFeature(BOOKS_FEATURE, booksStateReducer),
    EffectsModule.forFeature([BooksEffects])
  ],
  providers: [
    BooksService
  ]
})
export class BooksModule {
}
