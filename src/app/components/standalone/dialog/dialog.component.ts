import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { InputFieldComponent } from '../input-field/input-field.component';
import { Contact } from 'src/app/store/contact.model';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    DialogModule,
    ProgressSpinnerModule,
    ToastModule,
    ReactiveFormsModule,
    AvatarModule,
    AvatarGroupModule,
    ButtonModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() contact: Contact | null = null;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  visible: boolean = true;
  isLoading: boolean = false;
  phoneNumberValidator = Validators.pattern(/^\+?[0-9]{8,}$/);

  createContactForm: FormGroup = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.createContactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8), this.phoneNumberValidator,]],
      address: ['', Validators.required],
    });

    if (this.isEditMode && this.contact) {
      this.createContactForm.patchValue(this.contact);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createContactForm.controls;
  }

  async onSubmit() {
    let contactJson = this.createContactForm.value;
    try {
      if (this.isEditMode) {
        await this.editContact(contactJson);
      } else {
        await this.createContact(contactJson);
      }
    } catch (error) {
      this.setToastErrorMessage(error);
    }
  }

  async createContact(contactJson: Contact) {
    this.isLoading = true;
    try {
      this.contactService.addContact(contactJson);
      this.isLoading = false;
      this.resetForm();
      this.closeDialog(true);
    } catch (error) {
      this.isLoading = false;
      this.setToastErrorMessage(error);
    }
  }

  async editContact(contactJson: Contact) {
    if (this.contact) {
      this.isLoading = true;
      this.isLoading = false;
      this.resetForm();
      this.closeDialog(true);
    }
  }

  resetForm(): void {
    this.createContactForm.reset();
  }

  setToastErrorMessage(error: any) {
    this.isLoading = false;
    if (error.status === 400 && error.error.email) {
      this.messageService.add({
        severity: 'error',
        summary: this.isEditMode
          ? 'Edit contact failed!'
          : 'Creating contact failed!',
        detail: error.error.email[0],
      });
    } else {
      this.showError();
      console.log(error);
    }
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred!',
    });
  }

  closeDialog(success: boolean = false) {
    this.close.emit(success);
  }
}
