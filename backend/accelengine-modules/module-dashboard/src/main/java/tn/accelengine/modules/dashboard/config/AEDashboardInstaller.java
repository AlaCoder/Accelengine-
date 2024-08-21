package tn.accelengine.modules.dashboard.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import tn.accelengine.core.annotations.AEInstaller;
import tn.accelengine.modules.std.domain.Module;
import tn.accelengine.modules.std.domain.Module.CHECK_TYPE;
import tn.accelengine.modules.std.domain.Setting;
import tn.accelengine.modules.std.port.in.InitInput;
import tn.accelengine.modules.std.port.in.ModuleInput;

import java.util.HashSet;
import java.util.Set;

@AEInstaller
@RequiredArgsConstructor
@Slf4j
public class AEDashboardInstaller {

    public static final String MOD_CODE = "DASHBOARD";

    public static final String MOD_NAME = "Dashboard";

    public static final String MOD_VERSION = "0.0.1";

    private final ModuleInput moduleInput;

    private final InitInput initInput;

    @EventListener(ApplicationReadyEvent.class)
    @Order(20)
    public void configModuleAfterAllModulesStartup() {

        CHECK_TYPE action = this.moduleInput.checkModule(MOD_CODE, MOD_VERSION);

        if (action == CHECK_TYPE.CREATE) {
            Set<Setting> settings = new HashSet<>();

            log.info("AEDashboardInstaller : Create Module");
            this.moduleInput.createNewDataAPP(new Module(MOD_CODE, MOD_NAME, MOD_VERSION, settings), false);

            log.info("AEDashboardInstaller : Init Menus");
            this.initInput.initMenus("dashboard_menus.csv");
        }

        if (action == CHECK_TYPE.UPDATE) {
            log.info("AEDashboardInstaller : action UPDATE");
            if (MOD_VERSION.equals("1.0.0")) {
                log.info("UPDATE version 1.0.0");
            }
        }
    }
}
