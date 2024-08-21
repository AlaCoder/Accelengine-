export const environment = {
    production: true,
    apiBaseUrl: 'http://192.168.2.32:8088/ga/api',
    socketBaseUrl: ' ws://192.168.2.32:8088/ga/websocket',
    publicApiBaseUrl: 'http://192.168.2.32:8088/ga/api/public',
    applicationUrlRedirect: "/ga/static/",

    // Disco SOAP Service Core
    docUrl: 'http://192.168.2.212:8080/doc',
    wsdlUrl: 'http://192.168.2.27:8181/wsa/disco',
    targetNamespace: 'urn:MES:MES',
    method: 'wsdisco',
};
