import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsComponent } from './contacts.component';
import { ContactService } from 'src/app/services/contact.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogComponent } from '../standalone/dialog/dialog.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';


describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let contactService: ContactService;

  beforeEach(async () => {

    const contactServiceMock = {
      loadContacts: jasmine.createSpy('loadContacts'),
      contacts$: of([{ id: 1, firstname: 'John', lastname: 'Doe', email: 'john@doe.at', phone: '1234567890', address: 'Hauptplatz 1' }])
    };

    await TestBed.configureTestingModule({
      declarations: [ContactsComponent, ],
      providers: [
        { provide: ContactService, useValue: contactServiceMock },
        MessageService,
        ConfirmationService
      ],
      imports: [
        StoreModule.forRoot({}),
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
        DialogComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contacts on initialization', () => {
    expect(contactService.loadContacts).toHaveBeenCalled();
  });

  it('should toggle dialog to true when add new contact button is clicked', () => {
    const initialShowDialog = component.showDialog;
    component.toggleDialog();
    expect(component.showDialog).toBe(!initialShowDialog);
  });

  it('should set selectedContact when a contact button is clicked', () => {
    const contact = component.contacts[0];
    component.showContactDetails(contact);
    expect(component.selectedContact).toEqual(contact);
  });

  it('should display contact information when a contact is selected', () => {
    component.selectedContact = component.contacts[0];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.contact-info').textContent).toContain(component.selectedContact.firstname);
  });

  it('should render contact initials and contact buttons correctly', () => {
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('p-button'));
    const contactButton = buttons.find(button => button.nativeElement.textContent.includes('John Doe'));
    expect(contactButton).toBeTruthy('No button contains the text "John Doe"');
  });


  it('should close dialog and reset selectedContact on successful close event', () => {
    component.selectedContact = component.contacts[0];
    component.closeDialog(true);
    expect(component.showDialog).toBeFalse();
    expect(component.selectedContact).toBeNull();
  });
});
