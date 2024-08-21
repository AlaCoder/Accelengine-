package tn.accelengine.modules.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.jdom.Document;
import org.jdom.Element;

import tn.accelengine.commons.utils.XMLUtil;
import tn.accelengine.core.exceptions.AEBusinessException;
import tn.accelengine.core.exceptions.AENotFoundException;

public class WebServiceUtil {

    public static String getValueString(Element element, String name) {
        var res = XMLUtil.findFirstElement(element, name);
        return res == null ? null : res.getValue();
    }

    public static boolean getValueBoolean(Element element, String name) {
        var res = XMLUtil.findFirstElement(element, name);
        return res == null ? null : Boolean.parseBoolean(res.getValue());
    }

    public static Double getValueDouble(Element element, String name) {
        var res = XMLUtil.findFirstElement(element, name);
        try {
            return res == null ? null : Double.valueOf(res.getValue());
        } catch (NumberFormatException numberFormatException) {
            numberFormatException.printStackTrace();
        }
        return null;
    }

    public static Float getValueFloat(Element element, String name) {
        var res = XMLUtil.findFirstElement(element, name);
        try {
            return res == null ? null : Float.valueOf(res.getValue());
        } catch (NumberFormatException numberFormatException) {
            numberFormatException.printStackTrace();
        }
        return null;
    }

    public static Date getValueDate(Element element, String name, String formatDate) {
        var res = XMLUtil.findFirstElement(element, name);
        SimpleDateFormat sdf = new SimpleDateFormat(formatDate);
        try {
            return res == null ? null : sdf.parse(res.getValue());
        } catch (ParseException parseException) {
            parseException.printStackTrace();
        }
        return null;
    }

    public static Integer getValueInteger(Element element, String name) {
        var res = XMLUtil.findFirstElement(element, name);
        try {
            return res == null ? null : Integer.valueOf(res.getValue());
        } catch (NumberFormatException numberFormatException) {
            numberFormatException.printStackTrace();
        }
        return null;
    }

    public static String getStatusFromResponseWs(Document messageDocument) {
        Element returnValues = getReturnValuesFromResponseWs(messageDocument);
        Element successIndicator = getSuccessIndicatorFromResponseWs(returnValues);
        String status = successIndicator.getValue();
        return status;
    }

    public static Element getReturnValuesFromResponseWs(Document messageDocument) {
        Element returnValues = XMLUtil.findFirstElement(messageDocument.getRootElement(), "returnValues");
        if (returnValues == null) {
            throw new AEBusinessException("message", String.format("Erreur lors de récupération des résulats de webservice"));
        }
        return returnValues;
    }

    public static Element getSuccessIndicatorFromResponseWs(Element returnValues) {
        Element successIndicator = XMLUtil.findFirstElement(returnValues, "successIndicator");
        if (successIndicator == null) {
            throw new AEBusinessException("message", String.format("Erreur lors de la récupération des résulats de webservice"));
        }
        return successIndicator;
    }

    public static void checkConfigWs(String urlWs, String targetName, String ipDomain, String ws, String nameWebservice) {
        if (urlWs == null) {
            throw new AENotFoundException(
                    String.format("Erreur de lancement de ce traitement car l'url de wsdl n'est pas configuré"));
        }
        if (targetName == null) {
            throw new AENotFoundException(
                    String.format("Erreur de lancement de ce traitement car le target des webservices n'est pas configuré"));
        }
        if (ipDomain == null) {
            throw new AENotFoundException(
                    String.format("Erreur de lancement de ce traitement car le domaine n'est pas configuré"));
        }
        if (ws == null) {
            throw new AENotFoundException(String
                    .format("Erreur de lancement de ce traitement car le webservice de %s n'est pas configuré", nameWebservice));
        }
    }
}