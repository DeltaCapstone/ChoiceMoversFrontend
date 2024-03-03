// -------------------
// EMPLOYEE
// -------------------
export type EmployeeType = "Full-time" | "Part-time" | "Manager" | "Admin";

export function getEmployeeTypes(): EmployeeType[] {
    return ["Full-time", "Part-time", "Manager", "Admin"];
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
    employeeType: EmployeeType = "Full-time";
}
