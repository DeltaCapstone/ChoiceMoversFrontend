/**
 * Interface that describes the Customer type
 */
export interface ICustomer {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phonePrimary: string;
    phoneOther1: string;
    phoneOther2: string;
}

/**
 * Interface that describes the CustomerCreateRequest type
 */
export interface CustomerCreateRequest extends ICustomer {
    passwordPlain: string;
}

/**
 * Interface that describes the LoginRequest type
 */
export interface LoginRequest {
    userName: string;
    passwordPlain: string;
}


export interface CustomerProfileUpdateRequest {
    email: string;
    firstName: string;
    lastName: string;
    phonePrimary: string;
    phoneOther1: string;
    phoneOther2: string;
    userName: string;
}
/**
 * Interface that describes the CustomerUpdatePasswordRequest type
 */
export interface CustomerUpdatePasswordRequest {
    userName: string;
    passwordOld: string;
    passwordNew: string;
}
/**
 * Class that defines a Customer object and its properties and methods
 */
export class Customer implements ICustomer {
    userName: string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phonePrimary: string = '';
    phoneOther1: string = '';
    phoneOther2: string = '';

    constructor(username: string = '', firstName: string = '', lastName: string = '',
        email: string = '', phonePrimary: string = '', phoneOther1: string = '', phoneOther2: string = '') {

        this.userName = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phonePrimary = phonePrimary;
        this.phoneOther1 = phoneOther1;
        this.phoneOther2 = phoneOther2;
    }

    getUsername(): string {
        return this.userName;
    }

    setUsername(userName: string): void {
        this.userName = userName;
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

    getPhoneOther1(): string {
        return this.phoneOther1;
    }

    setPhoneOther1(phoneOther1: string): void {
        this.phoneOther1 = phoneOther1;
    }

    getPhoneOther2(): string {
        return this.phoneOther2;
    }

    setPhoneOther2(phoneOther2: string): void {
        this.phoneOther2 = phoneOther2;
    }
}


