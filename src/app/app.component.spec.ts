import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { StoreModule } from '@ngrx/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ContactService } from 'src/app/services/contact.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      BrowserModule,
      StoreModule.forRoot({}),
      ButtonModule,
      ConfirmDialogModule,
      ToastModule
    ],
    declarations: [
      AppComponent,
      ContactsComponent
    ],
    providers: [
      ContactService,
      MessageService,
      ConfirmationService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render ContactsComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-contacts')).not.toBeNull();
  });

  it(`should have as title 'simple-contact-list'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('simple-contact-list');
  });
});
