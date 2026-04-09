export interface AssignmentNewsEmployee {
  id: number;
  firstname: string;
  lastname: string;
}

export interface AssignmentNewsShift {
  id: number;
  shiftName: string;
  startTime: string;
  endTime: string;
}

export interface AssignmentNewsRole {
  id: number;
  roleName: string;
}

export interface AssignmentNews {
  id: number;
  confirmed: boolean | null;
  seen: boolean;
  employee: AssignmentNewsEmployee | null;
  shift: AssignmentNewsShift;
  role: AssignmentNewsRole;
}
