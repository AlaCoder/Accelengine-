package tn.accelengine.modules.start.job;

import java.util.stream.IntStream;

import javax.annotation.PostConstruct;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEJob;
import tn.accelengine.core.job.AEJobDetail;
import tn.accelengine.modules.std.domain.Job;
import tn.accelengine.modules.std.port.in.JobInput;

@AEJob
@Slf4j
public class TestJob extends AEJobDetail {

    @Autowired
    private JobInput jobInput;

    @PostConstruct
    public void init() {
        Job job = new Job();
        job.setName("Test");
        job.setGroupName("Group");
        job.setClassName(this.getClass().getName());
        job.setCronExpression("0 * * ? * *");
        job.setActivate(false);
        // uncomment it to create a job
        // jobInput.scheduleNewJob(job);
    }

    protected void executeJob(JobExecutionContext context) throws JobExecutionException {
        log.info("SampleCronJob Start................");
        IntStream.range(0, 10).forEach(i -> {
            log.info("Counting - {}", i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                log.error(e.getMessage(), e);
                Thread.currentThread().interrupt();
            }
        });
        log.info("SampleCronJob End................");
    }
}