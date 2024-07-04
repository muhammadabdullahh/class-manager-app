import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { CourseService } from '../../../services/course.service';
import { EventService } from '../../../services/event.service';
import { ScheduleService } from '../../../services/scheduled.service';
import { WeightedService } from '../../../services/weighted.service';
import { Router } from '@angular/router';
import { Course } from '../../../interfaces/course.model';
import { Event } from '../../../interfaces/event.model';
import { Scheduled } from '../../../interfaces/scheduled.model';
import { Weighted } from '../../../interfaces/weighted.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  authService = inject(AuthService);
  courseService = inject(CourseService);
  eventService = inject(EventService);
  scheduleService = inject(ScheduleService);
  weightedService = inject(WeightedService);
  private router = inject(Router);

  courses: Course[] = [];
  events: Event[] = [];
  schedules: Scheduled[] = [];
  weighteds: Weighted[] = [];

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/main-page']);
    } else {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.loadUserCourses();
  }

  loadUserCourses(): void {
    this.courseService.getUserCourses().subscribe({
      next: (courses: Course[]) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
        this.loadCourseEvents();
      },
      error: (err: any) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  loadCourseEvents(): void {
    this.courses.forEach(course => {
      this.eventService.getEvents(course.courseID).subscribe({
        next: (events: Event[]) => {
          console.log(`Events loaded for course ${course.courseID}:`, events);
          this.events.push(...events);
          this.loadEventSchedules(events);
          this.loadEventWeighteds(events);
        },
        error: (err: any) => {
          console.error(`Failed to load events for course ${course.courseID}`, err);
        }
      });
    });
  }

  loadEventSchedules(events: Event[]): void {
    events.forEach(event => {
      this.scheduleService.getSchedules(event.eventID).subscribe({
        next: (schedules: Scheduled[]) => {
          console.log(`Schedules loaded for event ${event.eventID}:`, schedules);
          this.schedules.push(...schedules);
        },
        error: (err: any) => {
          console.error(`Failed to load schedules for event ${event.eventID}`, err);
        }
      });
    });
  }

  loadEventWeighteds(events: Event[]): void {
    events.forEach(event => {
      this.weightedService.getWeighteds(event.eventID).subscribe({
        next: (weighteds: Weighted[]) => {
          console.log(`Weighteds loaded for event ${event.eventID}:`, weighteds);
          this.weighteds.push(...weighteds);
        },
        error: (err: any) => {
          console.error(`Failed to load weighteds for event ${event.eventID}`, err);
        }
      });
    });
  }
}
