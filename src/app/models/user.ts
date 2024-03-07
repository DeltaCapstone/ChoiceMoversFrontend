// -------------------
// EMPLOYEE
// -------------------
export enum EmployeeType {
    FullTime = "Full-time",
    PartTime = "Part-time",
    Manager = "Manager",
    Admin= "Admin"
}

export interface IEmployee {
    email: string;
    firstName: string
    lastName: string;
    phonePrimary: string;
    phoneOther: string | null;
    userName: string;
    employeeType: EmployeeType;
}

export interface CreateEmployeeRequest extends IEmployee {
    passwordPlain: string;
}

export class Employee implements IEmployee {
    email: string = "";
    firstName: string = "";
    lastName: string = "";
    phonePrimary: string = "";
    phoneOther: string | null = null;
    userName: string = "";
    employeeType: EmployeeType = EmployeeType.FullTime;
}
