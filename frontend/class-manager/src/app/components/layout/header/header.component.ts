import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor() {
    // grab everything we need
    const btn = document.querySelector("button.mobile-menu-button");
    const menu = document.querySelector(".mobile-menu");

    // add event listeners
    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    }
  }
}
