import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { StoreModule } from '@ngrx/store';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ContactService } from 'src/app/services/contact.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
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
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
