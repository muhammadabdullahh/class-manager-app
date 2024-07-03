import { Component } from '@angular/core';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {

}
