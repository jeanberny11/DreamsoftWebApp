import type { Country } from './country.type';

export interface Province {
    provinceId: number;
    name: string;
    country: Country;
    active: boolean;
}
