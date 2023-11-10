/*
 * Copyright (C) 2021 Radix IoT LLC. All rights reserved.
 */

class JsonStoreMenuController {
    static get $$ngIsClass() { return true; }
    static get $inject() { return ['maUiMenu', 'maEventBus']; }

    constructor(maUiMenu, maEventBus) {
        this.maUiMenu = maUiMenu;
        this.maEventBus = maEventBus;
    }

    $onInit() {
        this.retrieveMenu();

        this.maEventBus.subscribe('maUiMenu/menuChanged', (event, menuHierarchy) => {
            this.createMenuItemArray(menuHierarchy);
        });
    }

    retrieveMenu() {
        this.maUiMenu.getMenuHierarchy().then((menuHierarchy) => {
            this.createMenuItemArray(menuHierarchy);
        });
    }

    createMenuItemArray(menuHierarchy) {
        // slice array so we dont modify the original
        const rootArray = menuHierarchy.children.slice();

        // combine root menu items and items under ui into a top level menu array
        const i = rootArray.findIndex(item => item.name === 'ui');
        const ui = rootArray[i];
        rootArray.splice(i, 1, ...ui.children);

        this.menuItems = rootArray;
    }
}

export default {
    controller: JsonStoreMenuController,
    template: '<ma-ui-menu menu-items="$ctrl.menuItems" user="$ctrl.user"></ma-ui-menu>',
    bindings: {
        user: '<'
    }
};
