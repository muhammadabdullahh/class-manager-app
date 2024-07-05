import { Component, OnInit, inject } from '@angular/core';
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
  private courseService = inject(CourseService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  courses: Course[] = [];
  displayAddCourseDialog = false;
  submitted = false;
  courseForm!: FormGroup;
  terms = [
    { label: 'FALL', value: 'FALL' },
    { label: 'WINTER', value: 'WINTER' },
    { label: 'SUMMER', value: 'SUMMER' }
  ];

  ngOnInit(): void {
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
      credits: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      targetGrade: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      term: ['', Validators.required],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      syllabusURL: [''],
      notes: ['']
    });
  }

  showAddCourseDialog(): void {
    this.displayAddCourseDialog = true;
  }

  hideAddCourseDialog(): void {
    this.displayAddCourseDialog = false;
  }

  get f() {
    return this.courseForm.controls;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;

    if (this.courseForm.invalid) {
      return;
    }

    const courseData = this.courseForm.value;
    courseData.courseName = this.capitalizeWords(courseData.courseName);
    courseData.courseCode = courseData.courseCode.toUpperCase();
    courseData.semester = `${courseData.term}${courseData.year}`;

    if (new Date(courseData.endDate) <= new Date(courseData.startDate)) {
      this.courseForm.controls['endDate'].setErrors({ endBeforeStart: true });
      return;
    }

    console.log('Course Data:', courseData);

/*     this.courseService.createCourse(courseData).subscribe({
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
    }); */
  }

  capitalizeWords(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
