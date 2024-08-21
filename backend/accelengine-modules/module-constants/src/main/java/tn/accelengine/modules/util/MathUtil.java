package tn.accelengine.modules.util;

import java.text.DecimalFormat;

public class MathUtil {

    public static Float round(Float value) {
        if (value == null) {
            return 0F;
        }
        DecimalFormat df = new DecimalFormat("#.###");
        return Float.parseFloat(df.format(value).replace(",", "."));
    }

}