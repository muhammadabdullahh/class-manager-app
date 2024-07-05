import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CarouselModule } from 'primeng/carousel';

// Define an interface that extends Event and adds the endTime property
interface ExtendedEvent extends Event {
  endTime?: Date;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CarouselModule],
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
  events: ExtendedEvent[] = [];
  today: Date = new Date();

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
          events.forEach(event => {
            this.loadEventSchedules(event);
            this.loadEventWeighteds(event);
          });
        },
        error: (err: any) => {
          console.error(`Failed to load events for course ${course.courseID}`, err);
        }
      });
    });
  }

  loadEventSchedules(event: Event): void {
    this.scheduleService.getSchedules(event.eventID).subscribe({
      next: (schedules: Scheduled[]) => {
        console.log(`Schedules loaded for event ${event.eventID}:`, schedules);
        schedules.forEach(schedule => {
          this.events.push({ ...event, endTime: schedule.endTime });
        });
        this.sortEventsByDate();
      },
      error: (err: any) => {
        console.error(`Failed to load schedules for event ${event.eventID}`, err);
      }
    });
  }

  loadEventWeighteds(event: Event): void {
    this.weightedService.getWeighteds(event.eventID).subscribe({
      next: (weighteds: Weighted[]) => {
        console.log(`Weighteds loaded for event ${event.eventID}:`, weighteds);
        weighteds.forEach(weighted => {
          this.events.push({ ...event, endTime: weighted.endTime });
        });
        this.sortEventsByDate();
      },
      error: (err: any) => {
        console.error(`Failed to load weighteds for event ${event.eventID}`, err);
      }
    });
  }

  sortEventsByDate(): void {
    this.events.sort((a, b) => {
      const dateA = new Date(a.endTime!).getTime();
      const dateB = new Date(b.endTime!).getTime();
      return dateA - dateB;
    });
  }

  getCourseName(courseID: number): string {
    const course = this.courses.find(c => c.courseID === courseID);
    return course ? course.courseName : 'Unknown Course';
  }

  navigateToCourses(): void {
    this.router.navigate(['/courses-page']);
  }
}
