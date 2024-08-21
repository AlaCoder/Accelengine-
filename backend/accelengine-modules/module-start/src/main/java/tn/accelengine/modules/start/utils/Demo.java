package tn.accelengine.modules.start.utils;

import tn.accelengine.core.app.AEAppTranslate;
import tn.accelengine.modules.start.config.AEStartInstaller;

public class Demo {

    public static void translate() {
        System.err.println("Message translate");
        System.err.println(AEAppTranslate.getLocale().getLanguage());
        String msg = AEAppTranslate.getMessage(AEStartInstaller.MOD_CODE, "test_msg");
        System.err.println(msg);
    }

}
