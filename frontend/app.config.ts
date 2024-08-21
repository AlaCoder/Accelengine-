import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from './environments/environment';

export const APP_CONFIG = {
    apiBaseUrl: environment.apiBaseUrl,
    publicApiBaseUrl: environment.publicApiBaseUrl,
    socketBaseUrl: environment.socketBaseUrl,
    noBackend: false,
    fakeAuth: false,
    noToken: false,
    QADBackend: false,
    applicationUrlRedirect: environment.applicationUrlRedirect,

    // Disco SOAP Service Core
    wsdlUrl: environment.wsdlUrl,
    docUrl: environment.docUrl,
    targetNamespace: environment.targetNamespace,
    method: environment.method,
    theme: {
        theme: 'blue',
        layoutColor: 'blue',
        colorScheme: 'light',
        menuMode: 'static',
        inputStyle: 'filled'
    },
    app: {
        name: 'MES',
        loginPage: '/login',
        maintenancePage: '/maintenance',
        prefixNotificationsSocket: "/notifications",
        prefixBatchSocket: "/batchs/get",
        notFoundUrl: "/notfound",
        loggedRedirectPage: '/dashboard',
        languages: [
            { id: 'fr-FR', code: 'fr-FR', label: 'FR' },
            { id: 'en-EN', code: 'en-EN', label: 'EN' }
        ],
        language: 'fr-FR',
        currency: 'TN',
        animations: [
            trigger('slideInOut', [
                transition(':enter', [
                    style({ transform: 'translateX(100%)' }),
                    animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
                ]),
            ])
        ],
        rows: 100,
        rowsPerPageOptions: [100, 300, 500],
        pageSize: 100
    },
    tenant: {
        default: 'dis'
    },
    colors: {
        colors1: ['#b80000', '#db3e00', '#fccb00', '#008b02', '#006b76', '#1273de', '#004dcf',
            '#5300eb', '#eb9694', '#fad0c3', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'],
        colors2: ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60",
            "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
            "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"],
        colors3: ['#994f14', '#da291c', '#ffcd00', '#007a33', '#eb9ca8', '#7c878e', '#8a004f',
            '#000000', '#10069f', '#00a3e0', '#4cc1a1'],

        soft_colors: ['#b3e1ee', '#c4def6', '#b2ceff', '#a3ccf4', '#e6eff6', '#deefed', '#bfdbde',
            '#c3c7d2', '#d3b7cc', '#d4c4fb', '#f5cedf', '#fad0c3', '#d3e29d', '#c1e1c5', '#b9d6c8',
            '#c5c6a2', '#d2c1b5', '#c1c8c7', '#fff9e3', '#f1eaca', '#f4dc8c']
    }

};
