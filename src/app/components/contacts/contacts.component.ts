import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Contact } from '../../store/contact.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  contactsInitials: string[] = [];
  showDialog: boolean = false;
  selectedContact: Contact | null = null;
  private destroyed$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private contactService: ContactService,
  ) {  }

  ngOnInit() {
    this.contactService.loadContacts();
    this.subscribeObservables();
  }


  subscribeObservables() {
    this.contactService.contacts$.pipe(takeUntil(this.destroyed$)).subscribe(contacts => {
      this.contacts= contacts;
      this.getContactsInitials();
    })
  }


  getContactsInitials() {
    this.contactsInitials = [];
    this.contacts.forEach((contact) => {
      const initial = contact.firstname[0].toUpperCase();
      if (!this.contactsInitials.includes(initial)) {
        this.contactsInitials.push(initial);
      }
    });
  }

  toggleDialog(contact: Contact | null = null) {
    this.selectedContact = contact;
    this.showDialog = true;
  }

  closeDialog(success: boolean) {
    this.showDialog = false;
    if (success) {
      this.showSuccess('You have successfully added a contact!');
      this.selectedContact = null;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    }
  }

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
    });
  }

  showContactDetails(contact: Contact) {
    this.selectedContact = contact
  }


  getKeysSelectedContact(contact: Contact) {
    return Object.keys(contact).filter(key => key !== 'id') as (keyof Contact)[];
  }

  formatKey(key: string): string {
    return key[0].toUpperCase() + key.slice(1);
  }


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
