package tn.accelengine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import tn.accelengine.core.configs.AEHostConfig;

@Primary
@Component
public class AEHostConfigDocker extends AEHostConfig {

    @Autowired
    private Environment env;

    public boolean isDevMode() {
        String profile = this.env.getProperty("spring.profile");
        return profile != null && (profile.equals("prodLinux") || profile.equals("dev"));
    }

}
