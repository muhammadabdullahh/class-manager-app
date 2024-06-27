import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { LoginPageComponent } from '../login-page/login-page.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, LoginPageComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
