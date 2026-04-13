export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Subscription {
  id: string;
  package_name: string;
  total_sessions: number;
  used_sessions: number;
  start_date: string;
  end_date: string;
}

export interface Registration {
  id: string;
  class?: {
    name: string;
    day_of_week: string;
    time_slot: string;
  };
}

export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: string;
  current_grade: number;
  subscriptions?: Subscription[];
  registrations?: Registration[];
  parent?: Parent;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  day_of_week: string;
  time_slot: string;
  teacher_name: string;
  max_students: number;
  registrations?: Registration[];
}
