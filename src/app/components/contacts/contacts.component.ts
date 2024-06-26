import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
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
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {
  contacts: Contact[] = [];
  contactsInitials: string[] = [];
  showDialog: boolean = false;
  isEditMode: boolean = false;
  selectedContact: Contact | null = null;
  private destroyed$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private contactService: ContactService,
  ) {  }

  async ngOnInit() {
    this.contactService.loadContacts();
    this.subscribeObservables();
  }


  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  subscribeObservables() {
    this.contactService.contacts$.pipe(takeUntil(this.destroyed$)).subscribe(contacts => {
      this.contacts= contacts;
      this.getContactsInitials();
      this.cdRef.detectChanges();
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

  toggleDialog(isEdit: boolean = false, contact: Contact | null = null) {
    this.isEditMode = isEdit;
    this.selectedContact = contact;
    this.showDialog = true;
  }

  closeDialog(success: boolean) {
    this.showDialog = false;
    if (success) {
      this.showSuccess(this.isEditMode ? 'Contact updated successfully!' : 'You have successfully added a contact!');
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


/* ************OPTIONAL**************** */

  async deleteContact(id:number) {

  }

  openDeleteDialog(event: Event, contactId: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure to delete this contact?',
        header: 'Delete Contact',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: async() => {
          await this.deleteContact(contactId);
          this.selectedContact = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Contact successfully deleted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }
}
