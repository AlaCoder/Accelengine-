package tn.accelengine.modules.start.domain;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.core.entities.AEAuditingEntity;
import tn.accelengine.modules.start.config.AEStartInstaller;

@Entity
@DynamicUpdate
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = AEProperties.TABLE_APP_MODULE_PREFIX + AEStartInstaller.MOD_CODE + "_child", indexes = {
        @Index(columnList = "deleted"), @Index(columnList = "code, deleted") })
@SequenceGenerator(name = "default_sequence", sequenceName = "Child", allocationSize = 5)
public class Child extends AEAuditingEntity {

    private static final long serialVersionUID = 2023_01_26_153701L;

    private String name;

}