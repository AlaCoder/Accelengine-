package tn.accelengine.modules.start.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
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
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.accelengine.core.configs.AEProperties;
import tn.accelengine.core.domain.AEStatus;
import tn.accelengine.core.entities.AEWorkflow;
import tn.accelengine.modules.start.config.AEStartInstaller;
import tn.accelengine.modules.std.domain.AEFile;
import tn.accelengine.modules.std.domain.DictionaryType;
import tn.accelengine.modules.std.domain.DictionaryValue;
import tn.accelengine.modules.std.domain.Setting;

@Entity
@DynamicUpdate
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = AEProperties.TABLE_APP_MODULE_PREFIX + AEStartInstaller.MOD_CODE + "_father")
@SequenceGenerator(name = "default_sequence", sequenceName = "Father", allocationSize = 5)
public class Father extends AEWorkflow {

    private static final long serialVersionUID = 2023_01_26_153707L;

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

    private Double number4;

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

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "father_id")
    private Set<Child> childs = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "father_id")
    private Set<AEFile> documents = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "image_id")
    private AEFile image;

    private String dynamicType;

    @ManyToOne
    @JoinColumn(name = "dictionary_type_id1", referencedColumnName = "id")
    private DictionaryType dictionaryType1;

    @ManyToOne
    @JoinColumn(name = "dictionary_type_id2", referencedColumnName = "id")
    private DictionaryType dictionaryType2;

    @ManyToOne
    @JoinColumn(name = "setting_id", referencedColumnName = "id")
    private Setting setting;

    private int number5;

    public enum FATHER_TYPE {
        TYPE1, TYPE2, TYPE3;
    }

}
