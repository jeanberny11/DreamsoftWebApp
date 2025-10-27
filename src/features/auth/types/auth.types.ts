import type { Country } from "@/data/types/generics/country.type";
import type { Gender } from "@/data/types/generics/gender.type";
import type { IdType } from "@/data/types/generics/idType.type";
import type { Municipality } from "@/data/types/generics/municipality.type";
import type { Province } from "@/data/types/generics/province.type";

export interface Account {
    accountId: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    country: Country;
    province: Province;
    municipality: Municipality;
    accountType: AccountType;
    dob: string | null;
    gender: Gender;
    accountNumber: string;
    idNumber: string;
    idType: IdType;
}

export interface AccountType {
    accountTypeId: number;
    name: string;
}

export interface LoginRequest {
    email: string;
    userName: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface Role {
    roleId: number;
    name: string;
    superUser: boolean;
    admin: boolean;
    accountId: number;
}


export interface User {
    userId: number;
    account: Account;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role: Role;
    active: boolean;
}