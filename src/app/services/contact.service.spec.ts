import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { addContact, loadContacts } from '../store/contact.actions';
import { Contact } from '../store/contact.model';
import { selectAllContacts } from '../store/contact.selectors';
import { of } from 'rxjs';

describe('ContactService', () => {
  let service: ContactService;
  let store: MockStore;

  const initialState = {
    contacts: [
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@doe.at', phone: '1234567890', address: 'Hauptplatz 1' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      providers: [
        ContactService,
        provideMockStore({ initialState })
      ]
    });
    service = TestBed.inject(ContactService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch loadContacts action when loadContacts is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    service.loadContacts();
    expect(dispatchSpy).toHaveBeenCalledWith(loadContacts());
  });

  it('should dispatch addContact action when addContact is called', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const contact: Contact = { id: 2, firstname: 'Jane', lastname: 'Doe', email: 'jane@doe.at', phone: '0987654321', address: 'Hauptplatz 2' };
    service.addContact(contact);
    expect(dispatchSpy).toHaveBeenCalledWith(addContact({ contact }));
  });

  it('should select all contacts when getContacts is called', (done) => {
    const contacts = [
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@doe.at', phone: '1234567890', address: 'Hauptplatz 1' }
    ];
    store.overrideSelector(selectAllContacts, contacts);
    service.getContacts().subscribe((result) => {
      expect(result).toEqual(contacts);
      done();
    });
  });
});
