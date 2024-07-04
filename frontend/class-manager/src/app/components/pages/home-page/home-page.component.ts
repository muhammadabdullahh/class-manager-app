import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NavbarComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/main-page']);
    }
  }
}
