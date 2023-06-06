import {BookListComponent} from "./book-list.component";
import {BooksService} from "../../services/books.service";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MaterialModule} from "../../../shared/material.module";
import {Book} from "../../model/book";


describe('BookListComponent', () => {

  let testedComponent: BookListComponent;

  describe('[DOM]', () => {

    let fixture: ComponentFixture<BookListComponent>;
    let nativeElement: any;
    let booksServiceMock: any;
    let books: Book[];

    beforeEach(async () => {
      books = [{
        id: 1,
        title: 'Solaris',
        author: 'Stanisław Lem',
        description: 'Solaris chronicles the ultimate futility of attempted communications with the extraterrestrial life inhabiting a distant alien planet named Solaris. The planet is almost completely covered with an ocean of gel that is revealed to be a single, planet-encompassing entity. Terran scientists conjecture it is a living and a sentient being, and attempt to communicate with it.'
      }, {
        id: 2,
        title: '2001: A Space Odyssey',
        author: 'Aurthur C. Clarke',
        description: 'A mysterious alien civilization uses a tool with the appearance of a large crystalline monolith to investigate worlds across the galaxy and, if possible, to encourage the development of intelligent life. The book shows one such monolith appearing in prehistoric Africa, 3 million years ago (in the movie, 4 mya), where it inspires a starving group of hominids to develop tools. The hominids use their tools to kill animals and eat meat, ending their starvation. They then use the tools to kill a leopard preying on them; the next day, the main ape character, Moon-Watcher, uses a club to kill the leader of a rival tribe. The book suggests that the monolith was instrumental in awakening intelligence.'
      }, {
        id: 3,
        title: 'Ubik',
        author: 'Phillip K. Dick',
        description: 'By the year 1992, humanity has colonized the Moon and psychic powers are common. The protagonist, Joe Chip, is a debt-ridden technician working for Runciter Associates, a "prudence organization" employing "inertials"—people with the ability to negate the powers of telepaths and "precogs"—to enforce the privacy of clients. The company is run by Glen Runciter, assisted by his deceased wife Ella who is kept in a state of "half-life", a form of cryonic suspension that allows the deceased limited consciousness and ability to communicate. While consulting with Ella, Runciter discovers that her consciousness is being invaded by another half-lifer named Jory Miller.'
      }];
      booksServiceMock = {
        getBooks: jasmine.createSpy().and.returnValue(books),
        save: jasmine.createSpy()
      };

      await TestBed.configureTestingModule({
        declarations: [BookListComponent],
        imports: [MaterialModule],
        providers: [{ provide: BooksService, useValue: booksServiceMock }]
      }).compileComponents();
    });

    // test utility functions
    // "nouns"
    const bookList = () => nativeElement.querySelectorAll('li.clickable') as NodeList;
    const editor = () => nativeElement.querySelector('#editor') as HTMLElement;
    const bookAt = (position: number) => bookList().item(position) as HTMLLIElement;
    const saveButton = () => nativeElement.querySelector("button#save") as HTMLButtonElement;
    const cancelButton = () => nativeElement.querySelector("button#cancel") as HTMLButtonElement;
    const inputElementOfId = (id: string) => nativeElement.querySelector(`input#${id}`) as HTMLInputElement;
    const titleElement = () => inputElementOfId("title") as HTMLInputElement;
    const authorElement = () => inputElementOfId("author") as HTMLInputElement;
    const descriptionElement = () => nativeElement.querySelector("textarea#description") as HTMLTextAreaElement;
    // "verbs"
    const clickBookAt = (position: number) => bookAt(position).dispatchEvent(new MouseEvent('click'));
    const clickCancel = () => cancelButton().dispatchEvent(new MouseEvent('click'));
    const clickSave = () => saveButton().dispatchEvent(new MouseEvent('click'));
    const detectChanges = () => fixture.detectChanges();
    const editField = (fieldElement: HTMLInputElement | HTMLTextAreaElement, value: string) => fieldElement.value = value;

    beforeEach(() => {
      fixture = TestBed.createComponent(BookListComponent);
      testedComponent = fixture.componentInstance;
      nativeElement = fixture.nativeElement;
      detectChanges();
    });

    it('can be created', () => {
      expect(testedComponent).toBeTruthy();
    });

    it('does not show editor initially', () => {
      expect(editor()).toBeFalsy();
    });

    it('displays three books', () => {
      expect(bookList().length).toEqual(3);
    });

    it('shows an editor once a book is clicked', () => {
      // given
      const position = 1;
      const book = booksServiceMock.getBooks()[position];
      // when
      clickBookAt(position);
      detectChanges();
      // then
      expect(testedComponent.selectedBook).toBeTruthy();
      expect(testedComponent.selectedBook).toEqual(book);
      expect(editor()).toBeTruthy();
      expect(titleElement().value).toEqual(book.title);
      expect(authorElement().value).toEqual(book.author);
      expect(descriptionElement().value).toEqual(book.description);
    });

    it('it closes editor once cancel button is clicked', () => {
      // given
      clickBookAt(1);
      detectChanges();
      expect(editor()).toBeTruthy();
      expect(testedComponent.selectedBook).toBeTruthy();
      // when
      clickCancel();
      detectChanges();
      // then
      expect(editor()).toBeFalsy();
      expect(testedComponent.selectedBook).toBeNull();
    });

    it('it attempts to save unchanged selected book and close editor once save is clicked', () => {
      // given
      const position = 1;
      clickBookAt(position);
      const bookBeforeChange = booksServiceMock.getBooks()[position];
      detectChanges();
      expect(editor()).toBeTruthy();
      expect(testedComponent.selectedBook).toBeTruthy();
      // when
      clickSave();
      detectChanges();
      // then
      expect(editor()).toBeFalsy();
      expect(testedComponent.selectedBook).toBeNull();
      expect(booksServiceMock.getBooks()[position]).toEqual(bookBeforeChange);
    });

    it('saves a modified book', () => {
      // given
      const position = 1;
      clickBookAt(position);
      const bookBeforeChange = testedComponent.books[position];
      detectChanges();
      const newTitle = 'Foo';
      const newAuthor = 'Bar';
      const newDescription = 'Modified description';
      // when
      editField(titleElement(), newTitle);
      editField(authorElement(), newAuthor);
      editField(descriptionElement(), newDescription);
      clickSave();
      // detectChanges();
      // then
      expect(testedComponent.selectedBook).toBeFalsy();
      // expect(editor()).toBeFalsy();
      const modifiedBook = testedComponent.books[position];
      expect(modifiedBook).toBeTruthy();
      expect(booksServiceMock.save).toHaveBeenCalledWith({
        id: bookBeforeChange.id,
        title: newTitle,
        author: newAuthor,
        description: newDescription
      });
    });
  });

  describe('[class]', () => {
    let bookService: BooksService;

    beforeEach(() => {
      bookService = new BooksService();
      testedComponent = new BookListComponent(bookService);
    });

    it('has no selected book initially', () => {
      expect(testedComponent.selectedBook).toBeNull();
    });

    it('has three books on the list', () => {
      expect(testedComponent.books).toHaveSize(3);
    });

    it('has books identical to the ones in the service', () => {
      expect(testedComponent.books).toEqual(bookService.getBooks());
    })
  });
});
