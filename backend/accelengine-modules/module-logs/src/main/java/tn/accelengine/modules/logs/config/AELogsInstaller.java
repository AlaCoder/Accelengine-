package tn.accelengine.modules.logs.config;

import org.aeonbits.owner.ConfigCache;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEInstaller;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.modules.std.domain.Module;
import tn.accelengine.modules.std.domain.Module.CHECK_TYPE;
import tn.accelengine.modules.std.domain.Setting;
import tn.accelengine.modules.std.port.in.ApplicationInput;
import tn.accelengine.modules.std.port.in.InitInput;
import tn.accelengine.modules.std.port.in.ModuleInput;

import java.util.HashSet;
import java.util.Set;

@AEInstaller
@RequiredArgsConstructor
@Slf4j
public class AELogsInstaller {

    private static final AEProperties properties = ConfigCache.getOrCreate(AEProperties.class);

    public static final String MOD_CODE = "LOGS";

    public static final String MOD_NAME = "Logs";

    public static final String MOD_VERSION = "1.0.2";

    private final ModuleInput moduleInput;
    private final ApplicationInput applicationInput;
    private final InitInput initInput;

    @EventListener(ApplicationReadyEvent.class)
    @Order(25)
    public void configModuleAfterAEStartup() {

        CHECK_TYPE action = moduleInput.checkModule(MOD_CODE, MOD_VERSION);

        if (action == CHECK_TYPE.CREATE) {

            Set<Setting> settings = new HashSet<>();

            settings.add(new Setting("LOG_DIR_PATH", "Log Directory Path", Setting.TYPE_VALUE.STRING, "C:/DATA/logs", 10));

            log.info("AELogsInstaller : Create Module");
            moduleInput.createNewDataAPP(new Module(MOD_CODE, MOD_NAME, MOD_VERSION, settings), false);

            log.info("AELogsInstaller : Init Menus");
            this.initInput.initMenus("logs_menus.csv");

            log.info("AELogsInstaller : Init Translates");
            this.initInput.initTranslate("logs_translate.csv");

            log.info("AELogsInstaller : Init Translates");
            this.initInput.initTranslate("logs_translate_menu.csv");

            log.info("AELogsInstaller : Init data");
            // Log specific initial data logic here
        }

        if (action == CHECK_TYPE.UPDATE) {
            log.info("AELogsInstaller : action UPDATE");
            if (MOD_VERSION.equals("1.0.1")) {
                log.info("UPDATE version 1.0.1");
            }
        }
    }

    @EventListener(ApplicationReadyEvent.class)
    @Order(1010)
    public void configModuleAfterAEStartupOK() {
        // Any additional startup logic
    }
}
