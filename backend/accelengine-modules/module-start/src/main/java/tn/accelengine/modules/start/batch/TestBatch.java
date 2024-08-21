package tn.accelengine.modules.start.batch;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;

import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEBatch;
import tn.accelengine.core.app.AEAppTranslate;
import tn.accelengine.core.batch.AEBatchDetail;
import tn.accelengine.core.batch.AEBatchRunner;
import tn.accelengine.core.domain.BatchParameter;
import tn.accelengine.core.domain.BatchStatus;
import tn.accelengine.core.utils.LoggerUtil;
import tn.accelengine.modules.start.config.AEStartInstaller;
import tn.accelengine.modules.std.port.in.BatchInput;

@AEBatch
@Slf4j
public class TestBatch implements AEBatchDetail {

    public static final String BATCH_NAME = "TEST1";

    public static final String BATCH_DESCRIPTION = "Test Batch 1";

    @Autowired
    private BatchInput batchInput;

    @PostConstruct
    public void init() {
        batchInput.createNewBatch(BATCH_NAME, "Description Batch Test 1");
        AEBatchRunner.getInstance().register(BATCH_NAME, this);
    }

    @Override
    public BatchStatus beforeBatch(LoggerUtil logger, BatchParameter batchParameter) {
        logger.addInfoMessage("beforeBatch");
        logger.addInfoMessage("Parameter : " + batchParameter.toString());

        String msg = AEAppTranslate.getMessage(AEStartInstaller.MOD_CODE, "test_msg");
        logger.addInfoMessage(msg);
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }

        return BatchStatus.STARTED;
    }

    @Override
    public BatchStatus execute(LoggerUtil logger) {
        logger.addInfoMessage("execute");

        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }

        return BatchStatus.FINISHED;
    }

    @Override
    public BatchStatus afterBatch(LoggerUtil logger) {
        logger.addInfoMessage("afterBatch");

        return BatchStatus.COMPLETED;
    }

    @Override
    public BatchStatus stopBatch(LoggerUtil logger) {
        logger.addInfoMessage("stopBatch");

        return BatchStatus.STOPED;
    }

    @Override
    public void failedBatch(LoggerUtil logger) {
        logger.addInfoMessage("stopBatch");
    }

	@Override
	public String getOutputFilePath(LoggerUtil logger) {
		return null;
	}

}
