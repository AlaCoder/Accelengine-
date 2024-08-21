package tn.accelengine;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import tn.accelengine.core.app.AEAppRunUtil;

@SpringBootApplication
public class AccelEngineApplication {

    private static final Logger log = LoggerFactory.getLogger(AccelEngineApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(AccelEngineApplication.class);
        AEAppRunUtil.appStartup(log, app.run(args).getEnvironment());
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

}
