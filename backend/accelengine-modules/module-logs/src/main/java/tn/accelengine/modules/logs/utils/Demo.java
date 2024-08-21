package tn.accelengine.modules.logs.utils;

import tn.accelengine.core.app.AEAppTranslate;
import tn.accelengine.modules.logs.config.AELogsInstaller;

public class Demo {

    public static void translate() {
        System.err.println("Message translate");
        System.err.println(AEAppTranslate.getLocale().getLanguage());
        String msg = AEAppTranslate.getMessage(AELogsInstaller.MOD_CODE, "test_msg");
        System.err.println(msg);
    }

}
