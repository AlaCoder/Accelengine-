package tn.accelengine.modules.start.usecase;

import lombok.extern.slf4j.Slf4j;
import tn.accelengine.core.annotations.AEUseCase;
import tn.accelengine.modules.start.domain.Father;
import tn.accelengine.modules.start.dto.FatherDTO;
import tn.accelengine.modules.start.port.in.FatherInput;
import tn.accelengine.modules.start.port.out.FatherOutput;
import tn.accelengine.modules.workflow.extend.AEWorkflowUseCase;

@Slf4j
@AEUseCase
public class FatherUseCase extends AEWorkflowUseCase<Father, Father> implements FatherInput {

    public FatherUseCase(FatherOutput fatherOutput) {
        super(fatherOutput);
    }
void test(){
        this.authorization.assertCanRead(Father.class);
}
}
