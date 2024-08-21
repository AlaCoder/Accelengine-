package tn.accelengine.modules.start.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.core.domain.AEStatus;
import tn.accelengine.core.entities.AEEntity;
import tn.accelengine.modules.start.config.AEStartInstaller;
import tn.accelengine.modules.start.domain.Father.FATHER_TYPE;
import tn.accelengine.modules.std.domain.DictionaryValue;

@Entity
@DynamicUpdate
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = AEProperties.TABLE_APP_MODULE_PREFIX + AEStartInstaller.MOD_CODE + "_father")
@SequenceGenerator(name = "default_sequence", sequenceName = "Father", allocationSize = 5)
public class FatherDTO extends AEEntity {

    private String string1;

    private String string2;

    private String string3;

    @Enumerated(EnumType.STRING)
    private FATHER_TYPE string4;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = AEProperties.TABLE_APP_MODULE_PREFIX + AEStartInstaller.MOD_CODE
            + "_father_string5", joinColumns = @JoinColumn(name = "id"))
    private List<String> string5 = new ArrayList<>();

    private String string6;

    private String string7;

    private int number1;

    private int number2;

    private int number3;

    private int number4;

    private boolean boolean1;

    private Date date1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "priority_id")
    private AEStatus priority;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_father_id")
    private AEStatus statusFather;

    @ManyToOne
    @JoinColumn(name = "specialitie_id", referencedColumnName = "id")
    private DictionaryValue specialitie;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = AEProperties.TABLE_JOIN_PREFIX + "father_speciality")
    private Set<DictionaryValue> specialities;

    private int number5;

}
