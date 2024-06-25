import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../store/contact.model';
import { addContact, loadContacts } from '../store/contact.actions';
import { selectAllContacts } from '../store/contact.selectors';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  public contactSubject = new BehaviorSubject<Contact[]>([]);
  public contacts$ = this.contactSubject.asObservable();

  constructor(private store: Store) {
    this.contacts$ = this.store.select(selectAllContacts);
  }

  loadContacts(): void {
    this.store.dispatch(loadContacts());
  }

  addContact(contact: Contact): void {
    this.store.dispatch(addContact({ contact }));
  }

  getContacts(): Observable<Contact[]> {
    return this.contacts$;
  }
}
