import type { Province } from './province.type';

export interface Municipality {
    municipalityId: number;
    name: string;
    province: Province;
    active: boolean;
}
