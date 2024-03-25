import { s } from "@fullcalendar/core/internal-common";

/**
 * Enum class that defines types of residences
 */
export enum ResidenceType {
    House = "House",
    Apartment = "Apartment",
    Condo = "Condo",
    Business = "Business",
    Storage = "Storage Unit",
    Other = "Other"
}

/**
 * Interface that describes the Address type
 */
export interface IAddress {
    addressId: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    resType: ResidenceType;
    flights: number;
    aptNum: string;
}

/**
 * Class that defines an Address object and its properties and methods
 */
export class Address {
    addressId: number = 0;
    street: string = "";
    city: string = "";
    state: string = "";
    zip: string = "";
    resType: ResidenceType = ResidenceType.House;
    flights: number = 0;
    aptNum: string = "";

    constructor(addressId: number = 0, street: string = "", city: string = "", state: string = "",
        zip: string = "", resType: ResidenceType = ResidenceType.House, flights: number = 0, aptNum: string = "") {

        this.addressId = addressId;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.resType = resType;
        this.flights = flights;
        this.aptNum = aptNum;
    }

    getAddressId(): number {
        return this.addressId;
    }

    setAddressId(addressId: number): void {
        this.addressId = addressId
    }


    getStreet(): string {
        return this.street;
    }

    setStreet(street: string): void {
        this.street = street;
    }

    getCity(): string {
        return this.city;
    }

    setCity(city: string): void {
        this.city = city;
    }


    getState(): string {
        return this.state;
    }

    setState(state: string): void {
        this.state = state;
    }


    getZip(): string {
        return this.zip
    }

    setZip(zip: string): void {
        this.zip = zip;
    }


    getResType(): ResidenceType {
        return this.resType;
    }

    setResType(resType: ResidenceType): void {
        this.resType = resType;
    }


    getFlights(): number {
        return this.flights;
    }

    setFlights(flights: number): void {
        this.flights = flights;
    }


    getAptNum(): string {
        return this.aptNum;
    }

    setAptNum(aptNum: string): void {
        this.aptNum = aptNum;
    }
}
