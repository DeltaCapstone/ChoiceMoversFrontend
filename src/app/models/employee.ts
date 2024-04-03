// -------------------
// EMPLOYEE
// -------------------
export enum EmployeeType {
    FullTime = "Full-time",
    PartTime = "Part-time",
    Manager = "Manager",
    Admin = "Admin"
}

export interface IEmployee {
    email: string;
    firstName: string
    lastName: string;
    phonePrimary: string;
    phoneOther: string[];
    userName: string;
    employeeType: EmployeeType;
    employeePriority: number;
}

// should the password generated on the backend?
export interface EmployeeCreateRequest extends IEmployee {
    passwordPlain: string;
}

export interface LoginRequest {
    userName: string;    
    passwordPlain: string;    
}

export interface EmployeeProfileUpdateRequest {
    email: string;
    firstName: string
    lastName: string;
    phonePrimary: string;
    phoneOther: string[];
    userName: string;
}

export interface EmployeeTypePriorityRequest {
    userName: string;
    employeeType: EmployeeType;
    employeePriority: number;
}

export class Employee implements IEmployee {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    phonePrimary: string = "";
    phoneOther: string[] = [];
    userName: string = "";
    employeeType: EmployeeType = EmployeeType.FullTime;
    employeePriority: number = 3;
}

export class AssignedEmployee extends Employee {
    managerAssigned: boolean = false;
}
