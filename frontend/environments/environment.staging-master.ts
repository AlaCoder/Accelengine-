export const environment = {
    production: true,
    apiBaseUrl: 'http://10.10.20.28:8088/pfe/api',
    socketBaseUrl: ' ws://10.10.20.28:8088/pfe/websocket',
    applicationUrlRedirect: "/pfe/static/",

    // Disco SOAP Service Core
    docUrl: 'http://192.168.2.212:8080/doc',
    wsdlUrl: 'http://192.168.2.27:8181/wsa/disco',
    targetNamespace: 'urn:MES:MES',
    method: 'wsdisco',
};
