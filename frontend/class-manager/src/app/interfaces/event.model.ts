export interface Event {
    eventID: number;
    courseID: number;
    title: string;
    description: string;
    eventType: string;
    location: string;
    isComplete: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  