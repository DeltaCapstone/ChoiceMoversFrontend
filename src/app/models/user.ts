export interface User {
    employeeId: string,
    email: string;
    firstName: string;
    lastName: string;
    phonePrimary: string;
    phoneOther: string | null;
    userName: string;
    employeeType: string;
    passwordHash: string;
}
