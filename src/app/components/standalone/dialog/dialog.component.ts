import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { InputFieldComponent } from '../input-field/input-field.component';
import { Contact } from 'src/app/components/contacts/contact-model';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';

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
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
  });

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createContactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8), this.phoneNumberValidator,],
      ],
    });

    if (this.isEditMode && this.contact) {
      this.createContactForm.patchValue(this.contact);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createContactForm.controls;
  }

  getInitialsForAvatar(contact: string) {
    let nameParts = contact.split(' ');
    let initials = nameParts.slice(0, 2).map((part) => part[0].toUpperCase());
    return initials.join('');
  }

  async onSubmit() {
    let createContactJson = this.createContactForm.value;
    try {
      if (this.isEditMode) {
        await this.editContact(createContactJson);
      } else {
        await this.createContact(createContactJson);
      }
    } catch (error) {
      this.setToastErrorMessage(error);
    }
  }

  async createContact(createContactJson: Contact) {
    this.isLoading = true;
    this.isLoading = false;
    this.resetForm();
    this.closeDialog(true);
  }

  async editContact(createContactJson: Contact) {
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
