export type EmployeeType = "Full-time" | "Part-time" | "Manager" | "Admin";

export function getEmployeeTypes(): EmployeeType[] {
    return ["Full-time", "Part-time", "Manager", "Admin"];
}

export interface Employee {
    employeeId: string,
    email: string;
    firstName: string;
    lastName: string;
    phonePrimary: string;
    phoneOther: string | null;
    userName: string;
    employeeType: EmployeeType;
    passwordHash: string;
}
