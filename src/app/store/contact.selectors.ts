import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Contact } from './contact.model';

export const selectContacts = createFeatureSelector<Contact[]>('contacts');

export const selectAllContacts = createSelector(
  selectContacts,
  (contacts: Contact[]) => contacts
);
