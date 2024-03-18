/**
 * Interface that describes the Customer type
 */
export interface ICustomer {
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrimary: string;
    phoneOther: string;
}

/**
 * Class that defines a Customer object and its properties and methods
 */
export class Customer {
    username: string = "";
    passwordHash: string = "";
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    phonePrimary: string = "";
    phoneOther: string = "";

    constructor(username: string = "", passwordHash: string = "", firstName: string = "", lastName: string = "", 
        email: string = "", phonePrimary: string = "", phoneOther: string = "") {

        this.username = username;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phonePrimary = phonePrimary;
        this.phoneOther = phoneOther;
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string): void {
        this.username = username;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    setPasswordHash(passwordHash: string): void {
        this.passwordHash = passwordHash;
    }

    getFirstName(): string {
        return this.firstName;
    }

    setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getPhonePrimary(): string {
        return this.phonePrimary;
    }

    setPhonePrimary(phonePrimary: string): void {
        this.phonePrimary = phonePrimary;
    }

    getPhoneOther(): string {
        return this.phoneOther;
    }

    setPhoneOther(phoneOther: string): void {
        this.phoneOther = phoneOther;
    }
}


