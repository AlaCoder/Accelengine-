import { Injectable } from '@angular/core';

// Services

// Helpers
import { APP_CONFIG } from '@app/app.config';

declare var require: any;
var fastXmlParser = require('fast-xml-parser');
var xmlbuilder = require('xmlbuilder');

@Injectable()
export class WsDiscoHelper {

    public static MSG_ERROR = 'Une erreur a été detectée lors de l\'exécution de la requête du Web Service';
    constructor() { }

    public static getWsDiscoEnvelope(service: string, param: any): string {
        var sParam = {};
        sParam['sParam'] = param;
        const j2xParser = new fastXmlParser.j2xParser();
        const message = j2xParser.parse(sParam);
        var obj = {
            Envelope: {
                '@xmlns': 'http://schemas.xmlsoap.org/soap/envelope/',
                Body: {
                    wsdisco: {
                        '@xmlns': APP_CONFIG.targetNamespace,
                        ipService: {
                            '#text': service
                        },
                        ipMessage: {
                            '#text': message
                        }
                    }
                }
            }
        };
        var xmlData = xmlbuilder.create(obj, { encoding: 'utf-8' }).end({ pretty: true });
        return xmlData;
    }

    public static getWsDiscoEnvelopeDatas(service: string, param: any, dataName: string, datas: any): string {
        const j2xParser = new fastXmlParser.j2xParser();

        var master = {};
        master['sParam'] = param;
        master[dataName] = datas;

        var dataset = {};
        dataset['sDataset'] = master;
        const message = j2xParser.parse(dataset);

        var obj = {
            Envelope: {
                '@xmlns': 'http://schemas.xmlsoap.org/soap/envelope/',
                Body: {
                    wsdisco: {
                        '@xmlns': APP_CONFIG.targetNamespace,
                        ipService: {
                            '#text': service
                        },
                        ipMessage: {
                            '#text': message
                        }
                    }
                }
            }
        };
        var xmlData = xmlbuilder.create(obj, { encoding: 'utf-8' }).end({ pretty: true });
        return xmlData;
    }

    static getResponse(xml: Document): any {
        const sResponse = xml.getElementsByTagName('opMessage')[0].textContent;
        return fastXmlParser.parse(sResponse).ProDataSet;
    }

    static getValueByName(name: string, response: any): any {
        return response[name];
    }

    public static getErrorMessage(xml: Document): string {
        let value = xml.getElementsByTagName('errorMessage')[0].nodeValue;
        if (value == null) {
            return WsDiscoHelper.MSG_ERROR;
        }
        return value;
    }

}