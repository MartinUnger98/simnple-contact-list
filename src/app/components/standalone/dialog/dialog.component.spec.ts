import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ContactService } from 'src/app/services/contact.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    contactService = jasmine.createSpyObj('ContactService', ['addContact']);

    await TestBed.configureTestingModule({
      imports: [
        DialogComponent,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        MessageService,
        { provide: ContactService, useValue: contactService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty controls', () => {
    expect(component.createContactForm.controls['firstname'].value).toBe('');
    expect(component.createContactForm.controls['lastname'].value).toBe('');
    expect(component.createContactForm.controls['email'].value).toBe('');
    expect(component.createContactForm.controls['phone'].value).toBe('');
    expect(component.createContactForm.controls['address'].value).toBe('');
  });


  it('should call addContact method when form is submitted', async () => {
    const formBuilder = TestBed.inject(FormBuilder);
    component.createContactForm = formBuilder.group({
      firstname: ['John', Validators.required],
      lastname: ['Doe', Validators.required],
      email: ['john@example.com', [Validators.required, Validators.email]],
      phone: ['123456789', [Validators.required, Validators.pattern(/^\+?[0-9]{8,}$/)]],
      address: ['123 Main St', Validators.required]
    });
    fixture.detectChanges();

    contactService.addContact.and.returnValue(await Promise.resolve());

    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(contactService.addContact).toHaveBeenCalledWith(jasmine.objectContaining({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '123456789',
      address: '123 Main St'
    }));
  });

  it('should close the dialog when closeDialog is called', () => {
    spyOn(component.close, 'emit');
    component.closeDialog(true);
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });
});
