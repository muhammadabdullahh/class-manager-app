import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, NavbarComponent, InputTextModule, ButtonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  profile = {
    fullName: '',
    email: '',
    bio: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userDetails = this.authService.getUserDetail();
    this.profile.fullName = userDetails.fullName;
    this.profile.email = userDetails.email;
  }

  onSubmit(): void {
    console.log('Profile updated:', this.profile);
    // Here you would typically send the updated profile data to the backend
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login-page']);
  }
}
