import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  profile = {
    fullName: '',
    email: '',
    bio: ''
  };

  constructor(private authService: AuthService) {}

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
}
