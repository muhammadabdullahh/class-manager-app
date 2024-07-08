import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../interfaces/course.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {
  constructor(private el: ElementRef) {}

  private courseService = inject(CourseService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  userDetails: any = {};
  courses: Course[] = [];
  displayAddCourseDialog = false;
  displayCourseDetailsDialog = false;
  submitted = false;
  courseForm!: FormGroup;
  terms = [
    { label: 'FALL', value: 'FALL' },
    { label: 'WINTER', value: 'WINTER' },
    { label: 'SUMMER', value: 'SUMMER' }
  ];
  selectedCourse: Course | null = null;

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetail();
    this.loadCourses();
    this.initForm();
  }

  loadCourses(): void {
    this.courseService.getUserCourses().subscribe({
      next: (courses: Course[]) => {
        console.log('Courses loaded:', courses);
        this.courses = courses;
      },
      error: (err: any) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  initForm(): void {
    this.courseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      instructorName: ['', Validators.required],
      credits: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      targetGrade: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      term: ['', Validators.required],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      syllabusURL: ['', [Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)]],
      notes: ['']
    });
  }

  showAddCourseDialog(): void {
    this.displayAddCourseDialog = true;
  }

  hideAddCourseDialog(): void {
    this.displayAddCourseDialog = false;
  }

  showCourseDetailsDialog(course: Course): void {
    this.selectedCourse = course;
    this.displayCourseDetailsDialog = true;
  }

  hideCourseDetailsDialog(): void {
    this.displayCourseDetailsDialog = false;
  }

  get f() {
    return this.courseForm.controls;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;
  
    if (this.courseForm.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }
  
    const courseData = this.courseForm.value;
    delete courseData.term;
    delete courseData.year;
    courseData.courseName = this.capitalizeWords(courseData.courseName);
    courseData.instructorName = this.capitalizeWords(courseData.instructorName);
    courseData.courseCode = courseData.courseCode.toUpperCase();
    courseData.semester = `${this.courseForm.controls['term'].value}${this.courseForm.controls['year'].value}`;
    courseData.userID = this.userDetails.id;
  
    if (new Date(courseData.endDate) <= new Date(courseData.startDate)) {
      this.courseForm.controls['endDate'].setErrors({ endBeforeStart: true });
      this.scrollToFirstInvalidControl();
      return;
    }
  
    console.log('Course Data:', courseData);
    this.courseService.createCourse(courseData).subscribe({
      next: (course: Course) => {
        console.log('Course created:', course);
        this.courses.push(course);
        this.hideAddCourseDialog();
        this.courseForm.reset();
        this.submitted = false;
      },
      error: (err: any) => {
        console.error('Failed to create course', err);
      }
    });
  }
  
  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        console.log('Course deleted');
        this.courses = this.courses.filter(course => course.courseID !== courseId);
        this.hideCourseDetailsDialog();
      },
      error: (err: any) => {
        console.error('Failed to delete course', err);
      }
    });
  }

  editCourse(course: Course): void {
    this.courseForm.patchValue(course);
    this.displayAddCourseDialog = true;
    this.displayCourseDetailsDialog = false;
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('form .ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }

  capitalizeWords(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
