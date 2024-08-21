package tn.accelengine.modules.installer.config;

import java.util.*;

import org.aeonbits.owner.ConfigCache;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEInstaller;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.modules.std.domain.*;
import tn.accelengine.modules.std.domain.Module;
import tn.accelengine.modules.std.domain.Module.CHECK_TYPE;
import tn.accelengine.modules.std.port.in.ActionInput;
import tn.accelengine.modules.std.port.in.DocumentInput;
import tn.accelengine.modules.std.port.in.InitInput;
import tn.accelengine.modules.std.port.in.MenuInput;
import tn.accelengine.modules.std.port.in.ModuleInput;
import tn.accelengine.modules.std.port.in.RoleInput;
import tn.accelengine.modules.workflow.port.in.WorkflowInput;

@AEInstaller
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AEGlobalInstaller {

    private static final AEProperties properties = (AEProperties) ConfigCache.getOrCreate(AEProperties.class, new Map[0]);

    public static final String MOD_CODE = "INSTALLER";

    public static final String MOD_NAME = "Installation";

    public static final String MOD_VERSION = "1.0.0";

    private final ModuleInput moduleInput;

    private final DocumentInput documentInput;

    private final ActionInput actionInput;

    private final RoleInput roleInput;

    private final MenuInput menuInput;


    private final InitInput initInput;

    private final WorkflowInput workflowInput;

    @EventListener(ApplicationReadyEvent.class)
    @Order(11)
    public void configModuleBeforeAllModulesStartup() {
        log.info("AEGlobalInstaller : configModuleBeforeAllModulesStartup");

    }

    @EventListener(ApplicationReadyEvent.class)
    @Order(999)
    public void configModuleAfterAllModulesStartup() {

        CHECK_TYPE action = this.moduleInput.checkModule(MOD_CODE, MOD_VERSION);

        if (action == CHECK_TYPE.CREATE) {

            log.info("AEGlobalInstaller : Init Menus");
            this.initInput.initMenus("installer_menus.csv");

            Set<Setting> settings = new HashSet<>();

            log.info("AEGlobalInstaller : Create Module");
            this.moduleInput.createNewDataAPP(new Module(MOD_CODE, MOD_NAME, MOD_VERSION, settings), false);




        }

        if (action == CHECK_TYPE.UPDATE) {
            log.info("AEGlobalInstaller : action UPDATE");
            if (MOD_VERSION.equals("1.0.0")) {
                log.info("UPDATE version 1.0.0");
            }
        }
    }

}
