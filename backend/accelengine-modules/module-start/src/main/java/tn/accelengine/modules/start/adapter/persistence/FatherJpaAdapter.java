package tn.accelengine.modules.start.adapter.persistence;

import tn.accelengine.core.annotations.AEPersistenceAdapter;
import tn.accelengine.core.extend.AECrudJpaAdapter;
import tn.accelengine.modules.start.adapter.persistence.repo.FatherJpaRepository;
import tn.accelengine.modules.start.adapter.persistence.repo.FatherJpaRepositoryDTO;
import tn.accelengine.modules.start.domain.Father;
import tn.accelengine.modules.start.dto.FatherDTO;
import tn.accelengine.modules.start.port.out.FatherOutput;

@AEPersistenceAdapter
class FatherJpaAdapter extends AECrudJpaAdapter<Father, Father, FatherJpaRepository, FatherJpaRepositoryDTO>
        implements FatherOutput {

    public FatherJpaAdapter(FatherJpaRepository fatherJpaRepository, FatherJpaRepositoryDTO fatherJpaRepositoryDTO) {
        super(fatherJpaRepository, fatherJpaRepositoryDTO);
    }
}