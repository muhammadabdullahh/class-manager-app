import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('email') emailInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;
  @ViewChild('remember_me') rememberMeInput!: ElementRef;

  ngAfterViewInit() {
    // Now the ViewChild elements are available
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    //const rememberMe = this.rememberMeInput.nativeElement.checked;

    console.log('Email:', email);
    console.log('Password:', password);
    //console.log('Remember Me:', rememberMe);

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.router.navigate(['/home-page']);
      },
      error: (error) => {
      },
    });
  }
}
