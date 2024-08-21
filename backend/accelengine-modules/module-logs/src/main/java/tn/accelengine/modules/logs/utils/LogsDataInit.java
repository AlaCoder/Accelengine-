package tn.accelengine.modules.logs.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEUtil;
import tn.accelengine.core.domain.AEStatus;
import tn.accelengine.core.domain.AEStatusType;
import tn.accelengine.modules.std.port.in.AEStatusTypeInput;
import tn.accelengine.modules.std.port.in.DocumentInput;
import tn.accelengine.modules.std.port.in.RoleInput;
import tn.accelengine.modules.workflow.domain.Workflow;
import tn.accelengine.modules.workflow.domain.WorkflowConstraint;
import tn.accelengine.modules.workflow.domain.WorkflowDocumentConstraint;
import tn.accelengine.modules.workflow.domain.WorkflowTransition;
import tn.accelengine.modules.workflow.port.in.WorkflowDocumentConstraintInput;
import tn.accelengine.modules.workflow.port.in.WorkflowInput;

import java.util.HashSet;
import java.util.Set;

@AEUtil
@RequiredArgsConstructor
@Slf4j
public class LogsDataInit {

    private final WorkflowInput workflowInput;
    private final DocumentInput documentInput;
    private final RoleInput roleInput;
    private final WorkflowDocumentConstraintInput fieldConstraintInput;
    private final AEStatusTypeInput aeStatusTypeInput;

    public void init() {
        // Initialisation des données spécifiques au module logs
    }
}
