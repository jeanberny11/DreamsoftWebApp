import type { Module } from './module.type';
import type { MenuGroup } from './menuGroup.type';

export interface MenuOption {
    menuOptionId: number;
    name: string;
    module: Module;
    menuGroup: MenuGroup;
    url: string;
    icon: string;
    sortOrder: number;
    active: boolean;
}
