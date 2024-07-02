import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { LoginPageComponent } from '../login-page/login-page.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, LoginPageComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn () {
    return this.authService.isLoggedIn();
  } 

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home-page']);
    }
  }
}
