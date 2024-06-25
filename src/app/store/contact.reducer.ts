import { createReducer, on } from '@ngrx/store';
import { addContact, loadContacts, removeContact } from './contact.actions';
import { Contact } from './contact.model';

export const initialState: Contact[] = [];

const _contactReducer = createReducer(
  initialState,
  on(loadContacts, state => [...state]),
  on(addContact, (state, { contact }) => [...state, contact]),
  on(removeContact, (state, { contactId }) => state.filter(contact => contact.id !== contactId))
);

export function contactReducer(state: any, action: any) {
  return _contactReducer(state, action);
}
