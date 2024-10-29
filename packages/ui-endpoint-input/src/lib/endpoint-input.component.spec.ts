import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ConnectionStatusKind } from '@gqlx/util-introspection';
import { LucideAngularModule } from 'lucide-angular';
import { GqlxConnectionStatusIndicatorComponent } from './connection-status-indicator.component';
import { GqlxEndpointInputComponent } from './endpoint-input.component';

// NOTE: `componentInstance.isRunning` input must use alias `running`.
// So we need to set this input (and any other alias input) like so:
// componentRef.setInput("running", true)

describe('GqlxEndpointInputComponent', () => {
  let component: GqlxEndpointInputComponent;
  let fixture: ComponentFixture<GqlxEndpointInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        GqlxConnectionStatusIndicatorComponent,
        GqlxEndpointInputComponent,
        LucideAngularModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GqlxEndpointInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.endpoint()).toBeNull();
    expect(component.connectionStatus()).toBe(ConnectionStatusKind.UNKNOWN);
    expect(component.isRunning()).toBe(false);
  });

  it('should bind input properties correctly', () => {
    component.endpoint.set('http://localhost:4321/graphql');

    fixture.componentRef.setInput(
      'connectionStatus',
      ConnectionStatusKind.CONNECTED,
    );
    fixture.componentRef.setInput('running', true);

    fixture.detectChanges();

    expect(component.endpoint()).toBe('http://localhost:4321/graphql');
    expect(component.connectionStatus()).toBe(ConnectionStatusKind.CONNECTED);
    expect(component.isRunning()).toBe(true);
  });

  it('should emit execute event when execute button is clicked', () => {
    const executeSpy = jest.spyOn(component.execute, 'emit');
    expect(component.isRunning()).toBe(false);
    fixture.detectChanges();

    const executeButton = fixture.nativeElement.querySelector('button');
    executeButton.click();
    fixture.detectChanges();

    expect(executeSpy).toHaveBeenCalled();
  });

  it('should emit canceled event when cancel button is clicked while running', () => {
    const cancelSpy = jest.spyOn(component.canceled, 'emit');
    fixture.componentRef.setInput('running', true);
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector('button');
    cancelButton.click();
    fixture.detectChanges();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
