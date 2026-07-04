export type AttendanceStatus = 'checked_in' | 'checked_out';

export type EmployeePresence = 'present' | 'on_leave' | 'absent';

export type DashboardTab = 'employees' | 'attendance' | 'time_off';

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  presence: EmployeePresence;
}

export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
}
