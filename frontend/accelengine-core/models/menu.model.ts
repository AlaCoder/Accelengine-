import { AEEntity } from 'accelengine-lib';

export class Menu extends AEEntity {
    code: string;
    parentCode: string;
    label: string;
    url: string;
    icon: string;
    badge: string;
    badgeStyleClass: string;
    menus: Menu[];
    display: boolean;
    topMenu: boolean;
    modules: string;
}
