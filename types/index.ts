export interface Call {
  _id: string;
  shopName: string;
  shopNumber: string;
  callStatus: CallStatus;
  websiteDiscussed: WebsiteDiscussed;
  followUpDate?: string;
  followUpTime?: string;
  remarks?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CallStatus =
  | 'Answered'
  | 'Rejected'
  | 'Busy'
  | 'No Answer'
  | 'Switched Off'
  | 'Call Back Later';

export type WebsiteDiscussed = 'Yes' | 'No';

export type AddedBy = 'Aflah' | 'Anna';

export interface CallFormData {
  shopName: string;
  shopNumber: string;
  callStatus: CallStatus;
  websiteDiscussed: WebsiteDiscussed;
  followUpDate?: string;
  followUpTime?: string;
  remarks?: string;
}

export interface CallFilters {
  search?: string;
  callStatus?: CallStatus | '';
  websiteDiscussed?: WebsiteDiscussed | '';
  addedBy?: string;
  followUpDate?: string;
  startDate?: string;
  endDate?: string;
  quickFilter?: QuickFilter;
}

export type QuickFilter =
  | 'today'
  | 'tomorrow'
  | 'this-week'
  | 'this-month'
  | 'upcoming'
  | 'overdue'
  | 'answered'
  | 'rejected'
  | 'website-discussed'
  | 'not-discussed'
  | 'aflah'
  | 'anna'
  | '';

export interface Stats {
  total: number;
  answered: number;
  rejected: number;
  busy: number;
  websiteDiscussed: number;
  followUpsToday: number;
  upcomingFollowUps: number;
  overdueFollowUps: number;
  callsByAflah: number;
  callsByAnna: number;
  callsThisWeek: number;
  callsThisMonth: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
