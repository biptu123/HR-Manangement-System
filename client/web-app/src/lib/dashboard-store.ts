import { create } from 'zustand';
import { AttendanceStatus, DashboardTab } from './dashboard-types';

interface DashboardState {
  attendanceStatus: AttendanceStatus;
  checkInTime: Date | null;
  activeTab: DashboardTab;
  checkIn: () => void;
  checkOut: () => void;
  setActiveTab: (tab: DashboardTab) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  attendanceStatus: 'checked_out',
  checkInTime: null,
  activeTab: 'employees',

  checkIn: () => set({ attendanceStatus: 'checked_in', checkInTime: new Date() }),
  checkOut: () => set({ attendanceStatus: 'checked_out', checkInTime: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
