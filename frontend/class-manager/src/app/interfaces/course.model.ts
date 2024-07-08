export interface Course {
    courseID: number;
    courseName: string;
    courseCode: string;
    instructorName: string;
    credits: number;
    targetGrade: number;
    semester: string;
    startDate: Date;
    endDate: Date;
    syllabusURL: URL;
    notes: string;
    userID: string;
  }
  