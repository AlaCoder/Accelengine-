package tn.accelengine.modules.start.listener;

import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEEvent;
import tn.accelengine.core.annotations.AEListener;
import tn.accelengine.core.events.AEEventRunner;
import tn.accelengine.core.events.AEEventType;
import tn.accelengine.core.extend.AECrudMessage;
import tn.accelengine.modules.start.domain.Father;

import javax.annotation.PostConstruct;

@AEEvent
@Slf4j
public class FatherListener {

    @PostConstruct
    public void init() {
        AEEventRunner.getInstance().register(this);
    }

    @AEListener(type = AEEventType.ASYNC)
    public void fatherCreated(AECrudMessage.DataCreated<Father> data) {
        log.info("EVENT START : fatherCreated ok");

        log.info("EVENT END : fatherCreated ok ");
    }

    @AEListener(type = AEEventType.ASYNC)
    public void fatherUpdated(AECrudMessage.DataUpdated<Father> data) {
        log.info("EVENT START : fatherUpdated ok");

        log.info("EVENT END : fatherUpdated ok ");
    }
}
