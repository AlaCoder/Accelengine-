package tn.accelengine.modules.start.utils;

import static org.reflections.Reflections.log;

import java.util.HashSet;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import tn.accelengine.core.annotations.AEUtil;
import tn.accelengine.core.domain.AEStatus;
import tn.accelengine.core.domain.AEStatusType;
import tn.accelengine.core.domain.AEWorkflowStatus;
import tn.accelengine.modules.start.domain.Father;
import tn.accelengine.modules.std.port.in.AEStatusTypeInput;
import tn.accelengine.modules.std.port.in.DocumentInput;
import tn.accelengine.modules.std.port.in.RoleInput;
import tn.accelengine.modules.workflow.domain.Workflow;
import tn.accelengine.modules.workflow.domain.WorkflowConstraint;
import tn.accelengine.modules.workflow.domain.WorkflowDocumentConstraint;
import tn.accelengine.modules.workflow.domain.WorkflowTransition;
import tn.accelengine.modules.workflow.port.in.WorkflowDocumentConstraintInput;
import tn.accelengine.modules.workflow.port.in.WorkflowInput;

@AEUtil
@RequiredArgsConstructor
public class StartDataInit {

    private final WorkflowInput workflowInput;

    private final DocumentInput documentInput;

    private final RoleInput roleInput;

    private final WorkflowDocumentConstraintInput fieldConstraintInput;

    private final AEStatusTypeInput aeStatusTypeInput;

    public void init() {
        var fatherDocument = this.documentInput.findOneByCode(Father.class.getSimpleName());

        log.info("Create constraint {}");
        var constraint = new WorkflowConstraint();
        constraint.setFiledName("id");
        constraint.setFiledType(WorkflowConstraint.FieldType.NUMBER);
        constraint.setOperation(">");
        constraint.setValue("500");
        constraint.setOperator("&&");
        constraint.setConstraintOrder(1);

        log.info("Create DocumentConstraint {}");
        var documentConstraint = new WorkflowDocumentConstraint();
        documentConstraint.setName("id > 500");
        documentConstraint.setDocument(fatherDocument);
        documentConstraint.setConstraints(Set.of(constraint));
        documentConstraint = this.fieldConstraintInput.createNewDataAndGet(documentConstraint, false);

        Workflow workflow = new Workflow();
        workflow.setName("Father workflow");
        workflow.setDocument(fatherDocument);

        AEWorkflowStatus workflowStatus1 = new AEWorkflowStatus();
        workflowStatus1.setCode("INITIAL");
        workflowStatus1.setLabel("Initial");
        workflowStatus1.setEstimation("00-12-15");
        workflowStatus1.setStatusOrder(1);

        AEWorkflowStatus workflowStatus2 = new AEWorkflowStatus();
        workflowStatus2.setCode("INTERMEDIATE");
        workflowStatus2.setLabel("Intermédiaire");
        workflowStatus2.setEstimation("01-10-05");
        workflowStatus2.setStatusOrder(2);

        AEWorkflowStatus workflowStatus3 = new AEWorkflowStatus();
        workflowStatus3.setCode("FINAL");
        workflowStatus3.setLabel("Final");
        workflowStatus3.setEstimation("10-10-10");
        workflowStatus3.setStatusOrder(3);

        workflow.setInitialStatus(workflowStatus1);
        workflow.setFinalStatus(workflowStatus3);

        var adminRole = this.roleInput.findOneByCode("ADMIN_SYS");

        WorkflowTransition transition1 = new WorkflowTransition();
        transition1.setFromStatus(workflowStatus1);
        transition1.setToStatus(workflowStatus2);
        transition1.setCode("INITIAL -> INTERMEDIATE");
        transition1.setRoles(Set.of(adminRole));
        transition1.setConstraint(documentConstraint);
        transition1.setEstimation("30-22-30");

        WorkflowTransition transition2 = new WorkflowTransition();
        transition2.setFromStatus(workflowStatus2);
        transition2.setToStatus(workflowStatus3);
        transition2.setCode("INTERMEDIATE -> FINAL");
        transition2.setRoles(Set.of(adminRole));
        transition2.setConstraint(documentConstraint);
        transition1.setEstimation("24-23-22");

        Set<AEWorkflowStatus> workflowStatuses = new HashSet<>();
        workflowStatuses.add(workflowStatus1);
        workflowStatuses.add(workflowStatus2);
        workflowStatuses.add(workflowStatus3);
        workflow.setWorkflowStatuses(workflowStatuses);

        Set<WorkflowTransition> transitions = new HashSet<>();
        transitions.add(transition1);
        transitions.add(transition2);
        workflow.setTransitions(transitions);
        this.workflowInput.createNewDataAndGet(workflow, false);

        log.info("Create father statutes {}");
        var status1 = new AEStatus();
        status1.setCode("initial");
        status1.setLabel("initial");
        status1.setColor("#bdc3c7");

        var status2 = new AEStatus();
        status2.setCode("final");
        status2.setLabel("final");
        status2.setColor("#e74c3c");

        var statusType1 = new AEStatusType();
        statusType1.setDocument(fatherDocument);
        statusType1.setCode("statusFather");
        statusType1.setName("statusFather");
        statusType1.setPriority(false);
        statusType1.setStatuses(Set.of(status1, status2));
        this.aeStatusTypeInput.createNewDataAndGet(statusType1, false);

        var status3 = new AEStatus();
        status3.setCode("high");
        status3.setLabel("high");
        status3.setPriorityLevel(3);
        status3.setColor("#9b59b6");

        var status4 = new AEStatus();
        status4.setCode("low");
        status4.setLabel("low");
        status4.setPriorityLevel(1);
        status4.setColor("#f39c12");

        var statusType2 = new AEStatusType();
        statusType2.setDocument(fatherDocument);
        statusType2.setCode("priority");
        statusType2.setName("priority");
        statusType2.setPriority(true);
        statusType2.setStatuses(Set.of(status3, status4));
        this.aeStatusTypeInput.createNewDataAndGet(statusType2, false);

    }

}
