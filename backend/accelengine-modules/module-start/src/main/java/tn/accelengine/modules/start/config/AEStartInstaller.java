package tn.accelengine.modules.start.config;

import java.util.HashSet;
import java.util.Set;

import org.aeonbits.owner.ConfigCache;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEInstaller;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.core.domain.Document;
import tn.accelengine.modules.start.domain.Child;
import tn.accelengine.modules.start.domain.Father;
import tn.accelengine.modules.start.utils.Demo;
import tn.accelengine.modules.start.utils.StartDataInit;
import tn.accelengine.modules.std.domain.Module;
import tn.accelengine.modules.std.domain.Module.CHECK_TYPE;
import tn.accelengine.modules.std.domain.Setting;
import tn.accelengine.modules.std.port.in.ApplicationInput;
import tn.accelengine.modules.std.port.in.DictionaryTypeInput;
import tn.accelengine.modules.std.port.in.DocumentInput;
import tn.accelengine.modules.std.port.in.InitInput;
import tn.accelengine.modules.std.port.in.ModuleInput;

@AEInstaller
@RequiredArgsConstructor
@Slf4j
public class AEStartInstaller {

    private static final AEProperties properties = ConfigCache.getOrCreate(AEProperties.class);

    public static final String MOD_CODE = "START";

    public static final String MOD_NAME = "Start";

    public static final String MOD_VERSION = "2.0.0";

    private final ModuleInput moduleInput;

    private final ApplicationInput applicationInput;

    private final InitInput initInput;

    private final DocumentInput documentInput;

    private final StartDataInit startDataInit;

    private final DictionaryTypeInput dictionaryTypeInput;

    @EventListener(ApplicationReadyEvent.class)
    @Order(25)
    public void configModuleAfterAEStartup() {

        CHECK_TYPE action = moduleInput.checkModule(MOD_CODE, MOD_VERSION);

        if (action == CHECK_TYPE.CREATE) {

            Set<Setting> settings = new HashSet<>();

            settings.add(new Setting("PARAM1", "PARAM 1", Setting.TYPE_VALUE.STRING, "", 10));
            settings.add(new Setting("PARAM2", "PARAM 2", Setting.TYPE_VALUE.BOOLEAN, "", 20));

            log.info("AECustomerdataInstaller : Create Module");
            moduleInput.createNewDataAPP(new Module(MOD_CODE, MOD_NAME, MOD_VERSION, settings), false);

            log.info("AEDynamicFormInstaller : Create Documents");
            this.documentInput.createNewDataAndGet(new Document(Father.class.getSimpleName(), Father.class.getName()), false);
            this.documentInput.createNewDataAndGet(new Document(Child.class.getSimpleName(), Father.class.getName()), false);

            log.info("AEStartInstaller : Init Menus");
            this.initInput.initMenus("start_menus.csv");

            log.info("AEStartInstaller : Init Translates");
            this.initInput.initTranslate("start_translate.csv");

            log.info("AEStartInstaller : Init Translates");
            this.initInput.initTranslate("start_translate_menu.csv");

            log.info("AEStartInstaller : Init data");
            this.startDataInit.init();

            this.moduleInput.createNewDataCLI(new Module("A", "A", "1.0.0", null), false);
            this.moduleInput.createNewDataCLI(new Module("B", "B", "1.0.0", null), false);
            this.moduleInput.createNewDataCLI(new Module("C", "C", "1.0.0", null), false);
            this.moduleInput.createNewDataCLI(new Module("D", "D", "1.0.0", null), false);
        }

        if (action == CHECK_TYPE.UPDATE) {
            log.info("AEStdInstaller : action UPDATE");
            if (MOD_VERSION.equals("1.0.1")) {
                log.info("UPDATE version 1.0.1");
            }

        }
    }

    @EventListener(ApplicationReadyEvent.class)
    @Order(1010)
    public void configModuleAfterAEStartupOK() {
        Demo.translate();
    }
}
