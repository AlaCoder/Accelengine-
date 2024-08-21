import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, finalize, delay, mergeMap, materialize, dematerialize } from "rxjs/operators";
import { of, throwError } from 'rxjs';
import { each, remove } from 'lodash';
import { ErrorResponse } from 'accelengine-lib';
import { StatusCodes } from 'http-status-codes';

// data
import *  as  datasJson from '@app/assets/data.json';

// Services
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { LoadingService } from 'accelengine-lib';
import { MessageService } from 'primeng/api';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';

const log = new Logger('HttpCallInterceptor');

@Injectable({ providedIn: 'root' })
export class HttpCallInterceptor implements HttpInterceptor {

    calls: string[] = [];

    constructor(
        private storageService: StorageService,
        private translateService: TranslateService,
        private messageService: MessageService,
        private loadingService: LoadingService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const { url, method, headers, body } = request;
        const NoBackendURLs: string[] = [
            'application/info/1',
            'account/bylogin',
            '/menu/menu'
        ];

        this.loadingService.isLoading.next(true);
        this.calls.push(url);
        if (isHandleRouteOK()) {
            // wrap in delayed observable to simulate server api call
            return of(null)
                .pipe(mergeMap(handleRoute))
                .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
                .pipe(delay(500))
                .pipe(dematerialize())
                .pipe(
                    finalize(() => {
                        remove(this.calls, call => call === url);
                        if (this.calls.length == 0)
                            this.loadingService.isLoading.next(false);
                    }),
                    catchError((error: HttpErrorResponse) => {
                        doCatchError(error, this.translateService, this.messageService, null, this.router);
                        return ok(undefined);
                    })
                );
        } else {
            // add authorization header with jwt token if available
            const authToken: string | null = this.storageService.getToken();
            if (authToken) {
                var lang = '';
                if (this.translateService.currentLang) {
                    lang = this.translateService.currentLang;
                }
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${authToken}`,
                        'Accept-Language': lang
                    },
                });
            }
            // add tenant header if available
            const tenant: string | null = this.storageService.getCurrentTenant();
            if (tenant) {
                request = request.clone({
                    setHeaders: {
                        'X-TenantPath': tenant
                    }
                });
            }

            return next.handle(request).pipe(
                finalize(() => {
                    remove(this.calls, call => call === url);
                    if (this.calls.length == 0)
                        this.loadingService.isLoading.next(false);
                }),
                catchError((error: HttpErrorResponse) => {
                    let authenticationUrl: boolean = false;
                    if (url.endsWith('/authentication/authenticate')) {
                        authenticationUrl = true;
                    }
                    doCatchError(error, this.translateService, this.messageService, authenticationUrl, this.router);
                    remove(this.calls, call => call === url);
                    if (this.calls.length == 0)
                        this.loadingService.isLoading.next(false);
                    return ok(undefined);
                })
            );
        }

        function isHandleRouteOK(): boolean {
            if (url.endsWith('/authentication/authenticate') && method === 'POST') {
                return APP_CONFIG.fakeAuth;
            } else {
                if (APP_CONFIG.noBackend) {
                    let urlMapped = false;
                    each(NoBackendURLs, function (noBackendURL) {
                        urlMapped = url.endsWith(noBackendURL);
                        if (urlMapped) {
                            return;
                        }
                    });
                    return urlMapped;
                } else
                    return false;

            }
        }

        function handleRoute() {
            switch (true) {
                case url.endsWith('application/info'):
                    return getApplicationInfo();
                case url.endsWith('/authentication/authenticate'):
                    return authenticate();
                case url.endsWith('account/bylogin'):
                    return getAccountInfo();
                case url.endsWith('/menu/menu'):
                    return getMenu();
                default:
                    // pass through any requests not handled above
                    return error('URL not mapped');
            }
        }

        // DATA
        function getApplicationInfo() {
            const datas = datasJson;
            return ok(datas.application);
        }

        function authenticate() {
            const { username, password } = body;
            const datas = datasJson;
            const user = datas.users.find(x => x.username === username && x.password === password);
            if (!user) return error('Le nom d\'utilisateur ou le mot de passe est incorrect');
            return ok(user);
        }

        function getAccountInfo() {
            const { username } = body;
            const datas = datasJson;
            const user = datas.users.find(x => x.username === username);
            return ok(user);
        }

        function getMenu() {
            const datas = datasJson;
            return ok(datas.menus);
        }

        function doCatchError(error, translateService, messageService, authenticationUrl, router) {
            console.error(error);
            if (error.status === StatusCodes.UNAUTHORIZED) {
                if (authenticationUrl) {
                    messageService.add({ severity: 'error', summary: 'Erreur', detail: "Veuillez vérifier votre identifiant et votre mot de passe et essayer à nouveau" });
                    return of(undefined);
                }
                messageService.add({ severity: 'error', summary: 'Erreur', detail: "Vous n'avez pas l'autorisation pour exécuter cette action" });
                router.navigate([APP_CONFIG.app.loginPage]);
                return of(undefined);
            }else if (error.status === StatusCodes.SERVICE_UNAVAILABLE) {
                router.navigate([APP_CONFIG.app.maintenancePage]);
                return of(undefined);
            }
            let message;
            let errorResponse: ErrorResponse = new ErrorResponse();
            if (error instanceof HttpErrorResponse) {
                if (error.status === 0) {
                    message = translateService.instant('error.server_down', { value: message });
                    messageService.add({ severity: 'error', summary: 'Erreur', detail: message });
                    router.navigate([APP_CONFIG.app.loginPage]);
                    return of(undefined);
                } else {
                    errorResponse = error.error;
                    if (errorResponse.status === StatusCodes.BAD_REQUEST) {
                        if (errorResponse.violations) {
                            errorResponse.message = translateService.instant('messages.validation.constraint_violation', { value: errorResponse.detail });
                            each(errorResponse.violations, function (violation) {
                                errorResponse.message = errorResponse.message + `<br>[${violation.field}] : ${violation.message}`
                            });
                        }
                    }

                    if (error.error.message)
                        message = error.error.message;

                    if (error.error.detail)
                        message = error.error.detail;
                }
            }
            messageService.add({ severity: 'error', summary: 'Erreur', detail: message });
            return null;
        }

        // HELPER FUNCTIONS
        function ok(body?) {
            return of(new HttpResponse({ status: StatusCodes.OK, body }))
        }

        function error(message) {
            return throwError(() => new HttpErrorResponse({ status: StatusCodes.BAD_REQUEST, error: { message } }));
        }

        function unauthorized() {
            return throwError(() => new HttpErrorResponse({ status: StatusCodes.UNAUTHORIZED, error: { message: 'Unauthorised' } }));
        }
    }
}


export const HttpCallInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpCallInterceptor,
    multi: true
};
