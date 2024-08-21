
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';

// Models

// Services
import { MessageService } from 'primeng/api';
import { LoadingService } from 'accelengine-lib';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { WsDiscoHelper } from './ws-disco.helper';


// Disco SOAP Service Core Client
export class WsDiscoService {
    endpointService: string;
    xmlHttp: XMLHttpRequest = new XMLHttpRequest();
    response;

    messageService: MessageService;
    loadingService: LoadingService;
    constructor(injector: Injector) {
        this.messageService = injector.get(MessageService);
        this.loadingService = injector.get(LoadingService);
    }

    public invokeDiscoWS(service: string, param: any, dataName?: string, datas?: any): Observable<any> {
        return new Observable(observer => {

            setTimeout(() => {
                this.loadingService.isLoading.next(true);
            });

            let body;
            if (datas) {
                body = WsDiscoHelper.getWsDiscoEnvelopeDatas(service, param, dataName, datas);
            } else {
                body = WsDiscoHelper.getWsDiscoEnvelope(service, param);
            }

            this.xmlHttp.open('POST', APP_CONFIG.wsdlUrl, true);

            this.xmlHttp.setRequestHeader("Content-Type", "text/xml;charset=utf-8");
            this.xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            this.xmlHttp.setRequestHeader("SOAPAction", "");

            this.xmlHttp.send(body);
            this.xmlHttp.onreadystatechange = () => {
                if (this.xmlHttp.readyState == 4) {

                    setTimeout(() => {
                        this.loadingService.isLoading.next(false);
                    }, 500);

                    if (this.xmlHttp.status !== 200) {

                        let msg;
                        if (this.xmlHttp.responseXML == null) {
                            msg = 'Le serveur d\'application ne répond pas ! contactez l\'administrateur de votre domaine pour obtenir de l\'aide';
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: msg });
                            observer.error(msg);
                        }

                        msg = WsDiscoHelper.getErrorMessage(this.xmlHttp.responseXML);
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: msg });
                        observer.error(msg);
                    } else {
                        this.response = WsDiscoHelper.getResponse(this.xmlHttp.responseXML);
                        if (this.response == null) {
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: WsDiscoHelper.MSG_ERROR });
                            observer.error(WsDiscoHelper.MSG_ERROR);
                        } else {
                            if (!this.response.returnValues) {
                                this.messageService.add({ severity: 'error', summary: 'Erreur technique', detail: "returnValues not found !!!" });
                                observer.error(WsDiscoHelper.MSG_ERROR);
                            }
                            const data = this.response.returnValues;
                            if (data.successIndicator) {
                                observer.next(data);
                                observer.complete();
                            } else {
                                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: data.msg });
                                observer.error(this.decode(data.msg));
                            }
                        }
                    }
                }
            }
        });
    }

    public getDatas(name: string) {
        let datas = WsDiscoHelper.getValueByName(name, this.response);
        if (!datas) {
            datas = [];
        }
        if (!Array.isArray(datas)) {
            datas = [datas];
        }
        return datas;
    }

    public decode(input) {
        if (/&amp;|&quot;|&#39;|'&lt;|&gt;|&apos;/.test(input)) {
            var doc = new DOMParser().parseFromString(input, "text/html");
            return doc.documentElement.textContent;
        }
        return input;
    }

}
