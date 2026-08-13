import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app.component';
import { rolesReducer } from './roles/store/roles.reducer';
import { usersReducer } from './users/store/users.reducer';
import { httpLoadingReducer } from './http-loading/store/http-loading.reducer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideStore({
          roles: rolesReducer,
          users: usersReducer,
          httpLoading: httpLoadingReducer,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'interview' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('interview');
  });

  it('should show the boot loading screen while the current user has not loaded', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-boot-loading')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeFalsy();
  });
});
