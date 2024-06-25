import { createAction, props } from '@ngrx/store';
import { Contact } from './contact.model';

export const loadContacts = createAction('[Contact List] Load Contacts');
export const addContact = createAction('[Contact List] Add Contact', props<{ contact: Contact }>());
export const removeContact = createAction('[Contact List] Remove Contact', props<{ contactId: string }>());
