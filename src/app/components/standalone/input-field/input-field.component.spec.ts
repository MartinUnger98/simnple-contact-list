import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, InputFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on input change', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'test value';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.value).toBe('test value');
  });

  it('should call onIconClick when the icon is clicked', () => {
    spyOn(component, 'onIconClick');
    const iconElement = fixture.debugElement.query(By.css('p-inputGroupAddon')).nativeElement;
    iconElement.click();

    expect(component.onIconClick).toHaveBeenCalled();
  });

  it('should emit iconClick when the icon is clicked', () => {
    spyOn(component.iconClick, 'emit');
    const iconElement = fixture.debugElement.query(By.css('p-inputGroupAddon')).nativeElement;
    iconElement.click();

    expect(component.iconClick.emit).toHaveBeenCalled();
  });

  it('should display error message when errorMessage input is set', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-text')).nativeElement;
    expect(errorMessageElement.textContent).toContain('Test error message');
  });

  it('should propagate changes to the form control', () => {
    spyOn(component, 'onChange');
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'test value';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.onChange).toHaveBeenCalledWith('test value');
  });

  it('should call onTouched when input is changed', () => {
    spyOn(component, 'onTouched');
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.dispatchEvent(new Event('input'));

    expect(component.onTouched).toHaveBeenCalled();
  });
});
