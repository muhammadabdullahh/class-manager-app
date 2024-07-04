import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ProfilePageComponent } from '../../pages/profile-page/profile-page.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule, ProfilePageComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  darkMode: boolean = false;

  items: MenuItem[] | undefined;

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login-page']);
  }

  ngOnInit() {
    // grab everything we need
    const btn = document.querySelector('button.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');

    this.items = [
      {
        label: 'View Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: '/profile-page',
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => this.logout(),
      },
    ];

    // add event listeners
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.toggleDarkMode(true);
    } else if (savedTheme === 'light') {
      this.toggleDarkMode(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.toggleDarkMode(true);
    }
  }

  toggleDarkMode(bool: boolean) {
    this.darkMode = bool;

    if (bool) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
