import Dexie, { type Table } from 'dexie';

export interface UserProfile {
  id: string; 
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  profilePicUrl: string | null;
  syncStatus: 'PENDING' | 'SYNCED';
}



export class HRMSDatabase extends Dexie {
  currentUser!: Table<UserProfile>;    

  constructor() {
    super('HRMS_LocalDB');
    this.version(1).stores({
      currentUser: 'id, syncStatus'
    });
  }
}

export const db = new HRMSDatabase();