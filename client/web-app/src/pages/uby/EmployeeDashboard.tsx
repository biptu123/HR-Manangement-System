import { useEffect, useMemo, useRef, useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Plane,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Building2,
  MoreVertical,
  Users,
  Users2,
  Mail,
  MapPin,
  Phone,
  Calendar,
  X,
} from 'lucide-react';

/* ============================================================================
   1. TYPES
   ========================================================================= */

type AttendanceStatus = 'checked_in' | 'checked_out';
type EmployeePresence = 'present' | 'on_leave' | 'absent';
type DashboardTab = 'employees' | 'attendance' | 'time_off';

interface Employee {
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

interface CurrentUser {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
}

/* ============================================================================
   2. MOCK DATA
   ========================================================================= */

const CURRENT_USER: CurrentUser = {
  id: 'me',
  name: 'Aditi Sharma',
  role: 'Product Design Lead',
  department: 'Design',
  email: 'aditi.sharma@company.com',
  phone: '+91 98765 43210',
  location: 'Guwahati, IN',
  joinDate: 'March 12, 2022',
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Rahul Verma', role: 'Frontend Engineer', department: 'Engineering', email: 'rahul.verma@company.com', phone: '+91 90000 11111', location: 'Bengaluru, IN', joinDate: 'Jan 4, 2021', presence: 'present' },
  { id: '2', name: 'Priya Nair', role: 'HR Manager', department: 'People Ops', email: 'priya.nair@company.com', phone: '+91 90000 22222', location: 'Mumbai, IN', joinDate: 'Jul 19, 2020', presence: 'on_leave' },
  { id: '3', name: 'Arjun Das', role: 'Backend Engineer', department: 'Engineering', email: 'arjun.das@company.com', phone: '+91 90000 33333', location: 'Guwahati, IN', joinDate: 'Nov 2, 2022', presence: 'absent' },
  { id: '4', name: 'Sneha Patil', role: 'Marketing Lead', department: 'Marketing', email: 'sneha.patil@company.com', phone: '+91 90000 44444', location: 'Pune, IN', joinDate: 'Feb 27, 2019', presence: 'present' },
  { id: '5', name: 'Vikram Singh', role: 'DevOps Engineer', department: 'Engineering', email: 'vikram.singh@company.com', phone: '+91 90000 55555', location: 'Delhi, IN', joinDate: 'Sep 9, 2023', presence: 'present' },
  { id: '6', name: 'Ananya Iyer', role: 'UX Researcher', department: 'Design', email: 'ananya.iyer@company.com', phone: '+91 90000 66666', location: 'Chennai, IN', joinDate: 'May 15, 2021', presence: 'on_leave' },
  { id: '7', name: 'Karan Mehta', role: 'Sales Executive', department: 'Sales', email: 'karan.mehta@company.com', phone: '+91 90000 77777', location: 'Ahmedabad, IN', joinDate: 'Aug 30, 2022', presence: 'absent' },
  { id: '8', name: 'Divya Reddy', role: 'QA Engineer', department: 'Engineering', email: 'divya.reddy@company.com', phone: '+91 90000 88888', location: 'Hyderabad, IN', joinDate: 'Oct 11, 2020', presence: 'present' },
  { id: '9', name: 'Manish Gupta', role: 'Finance Analyst', department: 'Finance', email: 'manish.gupta@company.com', phone: '+91 90000 99999', location: 'Kolkata, IN', joinDate: 'Dec 5, 2023', presence: 'present' },
];

/* ============================================================================
   3. STATE MANAGEMENT (ZUSTAND)
   ========================================================================= */

interface DashboardState {
  attendanceStatus: AttendanceStatus;
  checkInTime: Date | null;
  activeTab: DashboardTab;
  checkIn: () => void;
  checkOut: () => void;
  setActiveTab: (tab: DashboardTab) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  attendanceStatus: 'checked_out',
  checkInTime: null,
  activeTab: 'employees',

  checkIn: () => set({ attendanceStatus: 'checked_in', checkInTime: new Date() }),
  checkOut: () => set({ attendanceStatus: 'checked_out', checkInTime: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

/* ============================================================================
   4. UTILITIES
   ========================================================================= */

const AVATAR_PALETTE = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  return initials || '?';
}

function getAvatarPalette(seed: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getAvatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

const PRESENCE_LABEL: Record<EmployeePresence, string> = {
  present: 'Present',
  on_leave: 'On leave',
  absent: 'Absent',
};

/* ============================================================================
   5. SHARED UI PRIMITIVES
   ========================================================================= */

function Avatar({ name, className = '' }: { name: string; className?: string }) {
  const palette = getAvatarPalette(name);
  return (
    <div className={`flex items-center justify-center rounded-full font-semibold ${palette.bg} ${palette.text} ${className}`}>
      {getInitials(name)}
    </div>
  );
}

function StatusIcon({ presence }: { presence: EmployeePresence }) {
  return (
    <div
      title={PRESENCE_LABEL[presence]}
      className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5"
    >
      {presence === 'present' && (
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
      )}
      {presence === 'on_leave' && <Plane className="h-3.5 w-3.5 text-sky-500" strokeWidth={2.5} />}
      {presence === 'absent' && <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />}
    </div>
  );
}

function StatusPill({ presence }: { presence: EmployeePresence }) {
  const textColor =
    presence === 'present' ? 'text-emerald-700' : presence === 'on_leave' ? 'text-sky-700' : 'text-amber-700';
  const bg = presence === 'present' ? 'bg-emerald-50' : presence === 'on_leave' ? 'bg-sky-50' : 'bg-amber-50';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${bg} px-3 py-1 text-xs font-medium ${textColor}`}>
      {presence === 'present' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {presence === 'on_leave' && <Plane className="h-3 w-3" strokeWidth={2.5} />}
      {presence === 'absent' && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
      {PRESENCE_LABEL[presence]}
    </span>
  );
}

/* ============================================================================
   6. NAVBAR PIECES
   ========================================================================= */

function CheckInToggle() {
  const { attendanceStatus, checkInTime, checkIn, checkOut } = useDashboardStore();
  const isCheckedIn = attendanceStatus === 'checked_in';

  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={isCheckedIn ? checkOut : checkIn}
        whileTap={{ scale: 0.9 }}
        title={isCheckedIn ? 'Check out' : 'Check in'}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-slate-50"
      >
        <span
          className={`h-3 w-3 rounded-full transition-colors duration-200 ${
            isCheckedIn
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
              : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isCheckedIn && checkInTime && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-[11px] font-medium text-slate-400"
          >
            Since {formatTime(checkInTime)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function AvatarMenu({ user }: { user: CurrentUser }) {
  const attendanceStatus = useDashboardStore((state) => state.attendanceStatus);
  const isCheckedIn = attendanceStatus === 'checked_in';

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50"
      >
        <div className="relative">
          <Avatar name={user.name} className="h-9 w-9 text-sm ring-2 ring-white" />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white transition-colors duration-300 ${
              isCheckedIn ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-red-500'
            }`}
          />
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-12 w-52 origin-top-right rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="my-1 h-px bg-slate-100" />
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              <UserIcon className="h-4 w-4" strokeWidth={2} />
              My Profile
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'employees', label: 'Employees' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'time_off', label: 'Time Off' },
];

function Navbar({ currentUser }: { currentUser: CurrentUser }) {
  const { activeTab, setActiveTab } = useDashboardStore();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Users2 className="h-4 w-4 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-slate-800">AcmeCorp</span>
        </div>

        {/* Center tabs */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-5 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'font-semibold text-slate-900'
                  : 'font-medium text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <CheckInToggle />
          <div className="h-8 w-px bg-slate-100" />
          <AvatarMenu user={currentUser} />
        </div>
      </div>
    </header>
  );
}

/* ============================================================================
   7. ACTION BAR
   ========================================================================= */

function ActionBar({
  searchQuery,
  onSearchChange,
  resultCount,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h1>
        <p className="mt-1 text-sm text-slate-400">{resultCount} people on the team</p>
      </div>

      <div className="flex items-center gap-3">
        {/* New employee */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          New Employee
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees..."
            className="w-64 rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-shadow focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   8. EMPLOYEE CARD / GRID
   ========================================================================= */

function EmployeeCardMenu({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-full p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-8 z-10 w-40 origin-top-right rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5"
          >
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              View profile
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              Edit
            </button>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmployeeCard({ employee, onSelect }: { employee: Employee; onSelect: (employee: Employee) => void }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(employee)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onSelect(employee);
      }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex w-full cursor-pointer items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition-shadow duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {/* Avatar with presence ring */}
      <div className="relative flex-shrink-0">
        <img
          src={getAvatarUrl(employee.id + employee.name)}
          alt={employee.name}
          className="h-11 w-11 rounded-full bg-slate-100 object-cover"
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
            employee.presence === 'present'
              ? 'bg-emerald-500'
              : employee.presence === 'on_leave'
              ? 'bg-sky-500'
              : 'bg-amber-400'
          }`}
          title={PRESENCE_LABEL[employee.presence]}
        />
      </div>

      {/* Name, role, location */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800">{employee.name}</h3>
        <p className="truncate text-sm text-slate-500">{employee.role}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{employee.location}</p>
      </div>

      {/* Overflow menu */}
      <EmployeeCardMenu employee={employee} />
    </motion.div>
  );
}

function EmployeeGrid({
  employees,
  searchQuery,
  onSelect,
}: {
  employees: Employee[];
  searchQuery: string;
  onSelect: (employee: Employee) => void;
}) {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white/60 py-24 text-center ring-1 ring-slate-900/5">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Users className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-slate-600">No employees found matching "{searchQuery}"</p>
        <p className="mt-1 text-sm text-slate-400">Try a different name, role, or department.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} onSelect={onSelect} />
      ))}
    </div>
  );
}

/* ============================================================================
   9. EMPLOYEE MODAL
   ========================================================================= */

const DETAIL_ROWS = (employee: Employee) => [
  { icon: Mail, label: 'Email', value: employee.email },
  { icon: Phone, label: 'Phone', value: employee.phone },
  { icon: MapPin, label: 'Location', value: employee.location },
  { icon: Calendar, label: 'Joined', value: employee.joinDate },
  { icon: Building2, label: 'Department', value: employee.department },
];

function EmployeeModal({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {employee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mt-4 flex flex-col items-center text-center">
                <img
                  src={getAvatarUrl(employee.id + employee.name)}
                  alt={employee.name}
                  className="mb-4 h-24 w-24 rounded-full bg-slate-100 object-cover shadow-sm"
                />
                <h2 className="text-2xl font-bold text-slate-800">{employee.name}</h2>
                <p className="mt-1 font-medium text-indigo-600">{employee.role}</p>
                <div className="mt-4">
                  <StatusPill presence={employee.presence} />
                </div>
              </div>

              <div className="mt-8 space-y-1">
                {DETAIL_ROWS(employee).map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="h-4 w-4 text-slate-500" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">{label}</p>
                      <p className="truncate text-sm font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-4">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   10. APP (default export)
   ========================================================================= */

export default function EmployeeDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentUser={CURRENT_USER} />

      <main className="mx-auto max-w-7xl px-6 pb-12">
        <ActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredEmployees.length}
        />

        <EmployeeGrid
          employees={filteredEmployees}
          searchQuery={searchQuery}
          onSelect={setSelectedEmployee}
        />
      </main>

      <EmployeeModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  );
}