package tn.accelengine.modules.start.batch;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;

import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEBatch;
import tn.accelengine.core.app.AEAppTranslate;
import tn.accelengine.core.batch.AEBatchDetail;
import tn.accelengine.core.batch.AEBatchRunner;
import tn.accelengine.core.domain.BatchParameter;
import tn.accelengine.core.domain.BatchStatus;
import tn.accelengine.core.exceptions.AEBatchException;
import tn.accelengine.core.utils.LoggerUtil;
import tn.accelengine.modules.start.utils.Demo;
import tn.accelengine.modules.std.port.in.BatchInput;

@AEBatch
@Slf4j
public class Test2Batch implements AEBatchDetail {

    public static final String BATCH_NAME = "TEST2";

    public static final String BATCH_DESCRIPTION = "Test Batch 2";

    @Autowired
    private BatchInput batchInput;

    @PostConstruct
    public void init() {
        this.batchInput.createNewBatch(BATCH_NAME, BATCH_DESCRIPTION);
        AEBatchRunner.getInstance().register(BATCH_NAME, this);
    }

    @Override
    public BatchStatus beforeBatch(LoggerUtil logger, BatchParameter batchParameter) {
        System.out.println("beforeBatch");
        logger.addInfoMessage("Parameter : " + batchParameter.toString());

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return BatchStatus.STARTED;
    }

    @Override
    public BatchStatus execute(LoggerUtil logger) {
        System.out.println("execute");
        System.out.println(LocaleContextHolder.getLocale());
        System.out.println(AEAppTranslate.getLocale());

        Demo.translate();

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        throw new AEBatchException("KO");

    }

    @Override
    public BatchStatus afterBatch(LoggerUtil logger) {
        System.out.println("afterBatch");

        return BatchStatus.COMPLETED;
    }

    @Override
    public BatchStatus stopBatch(LoggerUtil logger) {
        System.out.println("stopBatch");

        return BatchStatus.STOPED;
    }

    @Override
    public void failedBatch(LoggerUtil logger) {
        System.out.println("failedBatch");
    }

	@Override
	public String getOutputFilePath(LoggerUtil logger) {
		return null;
	}

}
