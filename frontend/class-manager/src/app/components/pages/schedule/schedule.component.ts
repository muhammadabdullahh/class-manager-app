import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';

interface Event {
  title: string;
  datetime: Date;
  endDatetime: Date;
  description?: string;
  eventType: 'Scheduled' | 'Weighted';
  location?: string;
  isComplete: boolean;
  dueDate?: Date;
  weight?: number;
}

interface CalendarDay {
  date: number;
  events: Event[];
  showMore?: boolean;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    DropdownModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  @ViewChild('weekContainer') weekContainer!: ElementRef;
  @ViewChild('eventsContainer') eventsContainer!: ElementRef;
  @ViewChild('threeDayContainer') threeDayContainer!: ElementRef;
  @ViewChild('eventsContainer3Day') eventsContainer3Day!: ElementRef;
  @ViewChild('dayContainer') dayContainer!: ElementRef;
  @ViewChild('eventsContainerDay') eventsContainerDay!: ElementRef;

  view: string = 'month';
  viewOptions: SelectItem[] = [
    { label: 'Month', value: 'month' },
    { label: 'Week', value: 'week' },
    { label: '3 Days', value: '3-day' },
    { label: 'Day', value: 'day' },
  ];

  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours: string[] = Array.from({ length: 24 }, (_, i) => this.formatHour(i));
  calendarDays: CalendarDay[] = [];
  weekDays: CalendarDay[] = [];
  threeDayViewDays: CalendarDay[] = [];
  dayViewEvents: Event[] = [];
  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear = this.currentDate.getFullYear();
  startOfWeek: Date = new Date();
  startOf3DayView: Date = new Date();
  eventDialogVisible: boolean = false;
  selectedEvent: Event | null = null;
  currentPeriodLabel = this.currentMonth + ' ' + this.currentYear;

  mockEvents: Event[] = [
    {
      title: 'Meeting with Bob',
      datetime: new Date(2024, 6, 10, 10, 0),
      endDatetime: new Date(2024, 6, 10, 11, 0),
      description: 'Discuss project updates.',
      eventType: 'Scheduled',
      location: 'Conference Room A',
      isComplete: false,
    },
    {
      title: 'Dentist Appointment',
      datetime: new Date(2024, 6, 15, 14, 0),
      endDatetime: new Date(2024, 6, 15, 15, 0),
      description: 'Routine check-up.',
      eventType: 'Scheduled',
      location: 'Dental Clinic',
      isComplete: false,
    },
    {
      title: 'Midterm Exam',
      datetime: new Date(2024, 7, 12, 9, 0),
      endDatetime: new Date(2024, 7, 12, 11, 0),
      description: 'Midterm exam for math.',
      eventType: 'Weighted',
      isComplete: false,
      dueDate: new Date(2024, 7, 12, 11, 0),
      weight: 50,
    },
    {
      title: 'Lunch with Sarah',
      datetime: new Date(2024, 6, 20, 12, 0),
      endDatetime: new Date(2024, 6, 20, 13, 0),
      description: 'Lunch meeting.',
      eventType: 'Scheduled',
      location: 'Cafe Bistro',
      isComplete: false,
    },
    {
      title: 'Team Meeting',
      datetime: new Date(2024, 6, 22, 10, 0),
      endDatetime: new Date(2024, 6, 22, 11, 0),
      description: 'Weekly sync-up.',
      eventType: 'Scheduled',
      location: 'Zoom',
      isComplete: false,
    },
    {
      title: 'Client Call',
      datetime: new Date(2024, 6, 23, 16, 0),
      endDatetime: new Date(2024, 6, 23, 17, 0),
      description: 'Call with a potential client.',
      eventType: 'Scheduled',
      location: 'Office',
      isComplete: false,
    },
    {
      title: 'Project Discussion',
      datetime: new Date(2024, 6, 10, 11, 0),
      endDatetime: new Date(2024, 6, 10, 12, 0),
      description: 'Discuss the new project.',
      eventType: 'Scheduled',
      location: 'Conference Room B',
      isComplete: false,
    },
    {
      title: 'Gym Session',
      datetime: new Date(2024, 6, 10, 12, 30),
      endDatetime: new Date(2024, 6, 10, 13, 30),
      description: 'Workout at the gym.',
      eventType: 'Scheduled',
      location: 'Gym',
      isComplete: false,
    },
    {
      title: 'Assignment Deadline',
      datetime: new Date(2024, 7, 25, 23, 59),
      endDatetime: new Date(2024, 7, 25, 23, 59),
      description: 'Submit final project assignment.',
      eventType: 'Weighted',
      isComplete: false,
      dueDate: new Date(2024, 7, 25, 23, 59),
      weight: 30,
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.setMonthDays();
    this.setWeekDays();
    this.set3DayViewDays();
    this.setDayViewEvents();
    this.generateMockData();
  }

  ngAfterViewInit() {
    this.scrollToStartTime();
  }

  async generateMockData() {
    this.calendarDays.forEach((day) => {
      day.events = this.mockEvents.filter(
        (event) =>
          event.datetime.getDate() === day.date &&
          event.datetime.getMonth() === this.currentDate.getMonth() &&
          event.datetime.getFullYear() === this.currentYear
      );
      day.showMore = false;
    });

    this.weekDays.forEach((day) => {
      day.events = this.mockEvents.filter(
        (event) =>
          event.datetime.getDate() === day.date &&
          event.datetime.getMonth() === this.currentDate.getMonth() &&
          event.datetime.getFullYear() === this.currentYear
      );
      day.showMore = false;
    });

    this.threeDayViewDays.forEach((day) => {
      day.events = this.mockEvents.filter(
        (event) =>
          event.datetime.getDate() === day.date &&
          event.datetime.getMonth() === this.currentDate.getMonth() &&
          event.datetime.getFullYear() === this.currentYear
      );
      day.showMore = false;
    });
    console.log(this.threeDayViewDays);
    

    this.dayViewEvents = this.mockEvents.filter(
      (event) =>
        event.datetime.getDate() === this.currentDate.getDate() &&
        event.datetime.getMonth() === this.currentDate.getMonth() &&
        event.datetime.getFullYear() === this.currentYear
    );
  }

  async setMonthDays() {
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    );
    this.calendarDays = [];
    while (date.getMonth() === this.currentDate.getMonth()) {
      this.calendarDays.push({
        date: date.getDate(),
        events: [],
        showMore: false,
      });
      date.setDate(date.getDate() + 1);
    }
    await this.generateMockData(); // Regenerate mock data for the new month
  }

  async setWeekDays() {
    this.startOfWeek = new Date(this.currentDate);
    this.startOfWeek.setDate(
      this.startOfWeek.getDate() - this.startOfWeek.getDay()
    );
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.startOfWeek);
      date.setDate(this.startOfWeek.getDate() + i);
      this.weekDays.push({ date: date.getDate(), events: [], showMore: false });
    }
    await this.generateMockData().then(() => {
      this.scrollToStartTime();
    });
  }

  async set3DayViewDays() {
    this.startOf3DayView = new Date(this.currentDate);
    this.threeDayViewDays = [];
    for (let i = 0; i < 3; i++) {
        const date = new Date(this.startOf3DayView);
        date.setDate(this.startOf3DayView.getDate() + i);
        this.threeDayViewDays.push({
            date: date.getDate(),
            events: [],
            showMore: false,
        });
    }
    await this.generateMockData().then(() => {
        this.scrollToStartTime3Day();
    });
}

async setDayViewEvents() {
    this.dayViewEvents = this.mockEvents.filter(
        (event) =>
            event.datetime.getDate() === this.currentDate.getDate() &&
            event.datetime.getMonth() === this.currentDate.getMonth() &&
            event.datetime.getFullYear() === this.currentYear
    );
    await this.generateMockData().then(() => {
        this.scrollToStartTimeDay();
    });
}


  prevPeriod() {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.currentMonth = this.currentDate.toLocaleString('default', {
        month: 'long',
      });
      this.currentYear = this.currentDate.getFullYear();
      this.setMonthDays();
      this.currentPeriodLabel = this.currentMonth + ' ' + this.currentYear;
    } else if (this.view === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
      this.setWeekDays();
      this.currentPeriodLabel = this.getWeekRange();
    } else if (this.view === '3-day') {
      this.currentDate.setDate(this.currentDate.getDate() - 3);
      this.set3DayViewDays();
      this.currentPeriodLabel = this.get3DayRange();
    } else if (this.view === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.setDayViewEvents();
      this.currentPeriodLabel = this.currentDate.toDateString();
    }
  }

  nextPeriod() {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentMonth = this.currentDate.toLocaleString('default', {
        month: 'long',
      });
      this.currentYear = this.currentDate.getFullYear();
      this.setMonthDays();
      this.currentPeriodLabel = this.currentMonth + ' ' + this.currentYear;
    } else if (this.view === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
      this.setWeekDays();
      this.currentPeriodLabel = this.getWeekRange();
    } else if (this.view === '3-day') {
      this.currentDate.setDate(this.currentDate.getDate() + 3);
      this.set3DayViewDays();
      this.currentPeriodLabel = this.get3DayRange();
    } else if (this.view === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.setDayViewEvents();
      this.currentPeriodLabel = this.currentDate.toDateString();
    }
  }

  toggleMore(day: CalendarDay) {
    day.showMore = !day.showMore;
  }

  getEventTop(event: Event) {
    const startHour = event.datetime.getHours();
    const startMinutes = event.datetime.getMinutes();
    return `${((startHour * 60 + startMinutes) / (24 * 60)) * 100}%`;
  }

  getEventHeight(event: Event) {
    const start = event.datetime.getTime();
    const end = event.endDatetime.getTime();
    const duration = (end - start) / (1000 * 60); // Duration in minutes
    return `${(duration / (24 * 60)) * 100}%`;
  }

  getEventLeft(events: Event[], currentEvent: Event) {
    const overlappingEvents = events.filter((event) =>
      this.isOverlapping(event, currentEvent)
    );
    const index = overlappingEvents.findIndex(
      (event) => event === currentEvent
    );
    return `${index * (100 / overlappingEvents.length)}%`;
  }

  getEventWidth(events: Event[], currentEvent: Event) {
    const overlappingEvents = events.filter((event) =>
      this.isOverlapping(event, currentEvent)
    );
    return `${100 / overlappingEvents.length}%`;
  }

  isOverlapping(event1: Event, event2: Event) {
    return (
      event1.datetime < event2.endDatetime &&
      event2.datetime < event1.endDatetime
    );
  }

  getWeekRange() {
    const endOfWeek = new Date(this.startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return `${this.startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  }

  get3DayRange() {
    const endOf3Day = new Date(this.startOf3DayView);
    endOf3Day.setDate(endOf3Day.getDate() + 2);
    return `${this.startOf3DayView.toLocaleDateString()} - ${endOf3Day.toLocaleDateString()}`;
  }

  openEventDialog(event: Event) {
    this.selectedEvent = event;
    this.eventDialogVisible = true;
  }

  formatHour(hour: number) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${ampm}`;
  }

  scrollToStartTime() {
    setTimeout(() => {
      if (this.eventsContainer && this.eventsContainer.nativeElement) {
        const scrollAmount = 8 * 16 * 4; // 8 hours * 16px per hour * 4 quarters per hour
        this.eventsContainer.nativeElement.scrollTop = scrollAmount;
      }
    }, 0);
  }

  scrollToStartTime3Day() {
    setTimeout(() => {
      if (this.eventsContainer3Day && this.eventsContainer3Day.nativeElement) {
        const scrollAmount = 8 * 16 * 4; // 8 hours * 16px per hour * 4 quarters per hour
        this.eventsContainer3Day.nativeElement.scrollTop = scrollAmount;
      }
    }, 0);
  }

  scrollToStartTimeDay() {
    setTimeout(() => {
      if (this.eventsContainerDay && this.eventsContainerDay.nativeElement) {
        const scrollAmount = 8 * 16 * 4; // 8 hours * 16px per hour * 4 quarters per hour
        this.eventsContainerDay.nativeElement.scrollTop = scrollAmount;
      }
    }, 0);
  }

  onViewChange(event: any) {
    if (this.view === 'month') {
        this.currentPeriodLabel = this.currentMonth + ' ' + this.currentYear;
    } else if (this.view === 'week') {
        this.setWeekDays();
        this.currentPeriodLabel = this.getWeekRange();
    } else if (this.view === '3-day') {
        this.set3DayViewDays();
        this.currentPeriodLabel = this.get3DayRange();
    } else if (this.view === 'day') {
        this.setDayViewEvents();
        this.currentPeriodLabel = this.currentDate.toDateString();
    }
}

}
