import { Injectable } from "@angular/core";
import { APP_CONFIG } from "@app/app.config";

@Injectable({ providedIn: "root" })
export class ThemeHelperService {
    constructor() { }

    changeTheme(theme) {
        APP_CONFIG.theme.theme = theme;
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const href = 'assets/theme/' + theme + '/theme-' + APP_CONFIG.theme.colorScheme + '.css';
        this.replaceLink(themeLink, href);
    }

    changeColorScheme(scheme) {
        APP_CONFIG.theme.colorScheme = scheme;
        APP_CONFIG.theme.colorScheme = scheme === 'dark' ? scheme : APP_CONFIG.theme.colorScheme;

        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + (scheme === 'dark' ? scheme : APP_CONFIG.theme.layoutColor) + '.css';
        this.replaceLink(layoutLink, layoutHref);

        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const themeHref = 'assets/theme/' + APP_CONFIG.theme.theme + '/theme-' + scheme + '.css';
        this.replaceLink(themeLink, themeHref);
    }

    changeLayoutColor(name) {
        APP_CONFIG.theme.layoutColor = name;
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + name + '.css';
        this.replaceLink(layoutLink, layoutHref);
    }



    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href, callback?) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    }
}
