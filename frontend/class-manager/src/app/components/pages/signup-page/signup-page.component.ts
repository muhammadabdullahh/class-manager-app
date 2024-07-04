import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css'],
})
export class SignupPageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  registerForm!: FormGroup;
  submitted = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(24),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  // Custom validator to check that two fields match
  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Custom validator for password
  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasAlphabet = /[a-zA-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);

    const passwordValid =
      hasNumber && hasAlphabet && hasSpecial && hasUppercase;
    if (!passwordValid) {
      return { passwordStrength: true };
    }
    return null;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const { email, fullName, password, confirmPassword } = this.registerForm.value;

    console.log('Email:', email);
    console.log('Name:', fullName);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    this.authService.register({ email, fullName, password, roles: ["USER"] }).subscribe({
      next: (response) => {
        this.router.navigate(['/home-page']);
      },
      error: (error) => {},
    });
    }

    // Convenience getter for easy access to form fields
    get f() {
      return this.registerForm.controls;
  }
}
