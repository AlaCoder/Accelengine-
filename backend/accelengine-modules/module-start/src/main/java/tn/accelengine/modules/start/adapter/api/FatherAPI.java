package tn.accelengine.modules.start.adapter.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tn.accelengine.core.extend.AECrudApi;
import tn.accelengine.modules.start.domain.Father;
import tn.accelengine.modules.start.dto.FatherDTO;
import tn.accelengine.modules.start.port.in.FatherInput;

@RestController
@RequestMapping(value = FatherAPI.ENDPOINT)
class FatherAPI extends AECrudApi<Father, Father> {

    public static final String ENDPOINT = ROOT_ENDPOINT + "/start/father";

    private final FatherInput fatherInput;

    public FatherAPI(FatherInput fatherInput) {
        super(fatherInput);
        this.fatherInput = fatherInput;
    }
}
