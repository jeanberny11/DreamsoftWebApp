import type { Role } from '../auth/role.type';
import type { MenuOption } from './menuOption.type';

export interface RoleOption {
    roleOptionId: number;
    role: Role;
    menuOption: MenuOption;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}
