import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TreeSelectModule } from 'primeng/treeselect';
// NEW
import { GMapModule } from 'primeng/gmap';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { EditorModule } from 'primeng/editor';

import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorBlockModule } from 'ngx-color/block';
import { ColorGithubModule } from 'ngx-color/github';
import { ColorCompactModule } from 'ngx-color/compact';
import { DndModule } from 'ngx-drag-drop';

//  components
import { MenuMasterComponent } from './components/menu/menu-master/menu-master.component';
import { MenuDetailComponent } from './components/menu/menu-detail/menu-detail.component';
import { MenuSaveComponent } from './components/menu/menu-save/menu-save.component';
import { MenuCrudComponent } from './components/menu/menu-crud/menu-crud.component';
import { MainDataTableComponent } from './components/data-table/main/main-data-table.component';
import { SelectableDataTableComponent } from './components/data-table/selectable/selectable-data-table.component';
import { InputFormComponent } from './components/forms/input-form.component';
import { InputTextareaFormComponent } from './components/forms/input-textarea-form.component';
import { InputValidationComponent } from './components/forms/validation-form.component';
import { SelectFormComponent } from './components/forms/select-form.component';
import { MultiSelectFormComponent } from './components/forms/multiselect-form.component';
import { SwitchFormComponent } from './components/forms/switch-form.component';
import { CriteriaComponent } from './components/criteria/criteria.component';
import { InputDateComponent } from './components/forms/input-date.component';
import { InputNumberComponent } from './components/forms/input-number.component';
import { FileFormComponent } from './components/forms/file-form.component';
import { InputColorComponent } from './components/forms/input-color.component';
import { DictionarySelectComponent } from './components/dictionary-select/dictionary-select.component';
import { NotificationsComponent } from '../accelengine-shared/components/notifications/notifications.component';
import { DictionaryMultiSelectComponent } from './components/dictionary-multiselect/dictionary-multiselect.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { FlowchartComponent } from './components/flowchart/flowchart.component';
import { TreeSelectFormComponent } from './components/forms/tree-select-form.component';
import { InputDateTimeComponent } from './components/forms/input-date-time.component';
import { MenuBookmarkComponent } from './components/menu/menu-bookmark/menu-bookmark.component';
import { ActionHistoryComponent } from './components/action-history/action-history.component';
import { InputRadioButtonComponent } from './components/forms/input-radio-button.component';
import { InputMaskComponent } from './components/forms/input-mask.component';
import { StatusSelectComponent } from './components/status-select/status-select.component';
import { PopupCriteriaComponent } from './components/popup-criteria/popup-criteria.component';

//workflow
import { WorkflowStatusComponent } from './workflow/workflow-status/workflow-status.component';
import { WorkflowHistoryComponent } from './workflow/workflow-history/workflow-history.component';
//dynamic form
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

// File explorer
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';

// File
import { ManagementDocumentComponent } from './file/management-document/management-document.component';
import { AddDocumentComponent } from './file/add-document/add-document.component';
import { UploadDocumentComponent } from './file/upload-document/upload-document.component';

// Redirect
import { RedirectComponent } from './redirect/redirect.component';

// Service
import { AEWorkflowService } from '@app/accelengine-core/services/aeworkflow.service';
import { WorkflowService } from '@app/accelengine-modules/module-workflow/services/workflow.service';
import { TransitionService } from '@app/accelengine-modules/module-workflow/services/workflow-transition.service';
import { DynamicFormService } from '@app/accelengine-modules/module-dynamic-form/services/dynamic.form.service';
import { AEStatusTypeService } from '@app/accelengine-std/services/status-type.service';

// Directives
import { IsMobileDirective } from '../accelengine-shared/directives/is-mobile.directive';
import { IsDesktopDirective } from '../accelengine-shared/directives/is-desktop.directive';
import { IsTabletDirective } from '../accelengine-shared/directives/is-tablet.directive';

const PRIMENG = [
    AccordionModule,
    AutoCompleteModule,
    AvatarGroupModule,
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    CheckboxModule,
    ChipModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    FullCalendarModule,
    GalleriaModule,
    ImageModule,
    InplaceModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    KnobModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    ScrollPanelModule,
    ScrollTopModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SplitButtonModule,
    SplitterModule,
    StepsModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TagModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VirtualScrollerModule,
    //
    GMapModule,
    TimelineModule,
    BadgeModule,
    TagModule,
    SkeletonModule,
    ProgressSpinnerModule,
    ChipModule,
    SplitterModule,
    BlockUIModule,
    TreeSelectModule,
    EditorModule
];

const COMPONENTS = [
    MenuMasterComponent,
    MenuDetailComponent,
    MenuSaveComponent,
    MenuCrudComponent,
    MenuBookmarkComponent,
    MainDataTableComponent,
    SelectableDataTableComponent,
    InputFormComponent,
    InputTextareaFormComponent,
    InputValidationComponent,
    SelectFormComponent,
    MultiSelectFormComponent,
    SwitchFormComponent,
    CriteriaComponent,
    InputDateComponent,
    InputNumberComponent,
    FileFormComponent,
    InputColorComponent,
    DictionarySelectComponent,
    NotificationsComponent,
    DictionaryMultiSelectComponent,
    AutoCompleteComponent,
    FlowchartComponent,
    TreeSelectFormComponent,
    InputDateTimeComponent,
    InputMaskComponent,
    StatusSelectComponent,
    // Workflow
    WorkflowStatusComponent,
    WorkflowHistoryComponent,
    RedirectComponent,
    //dynamicForm
    DynamicFormComponent,
    // File explorer
    FileExplorerComponent,
    //file
    ManagementDocumentComponent,
    AddDocumentComponent,
    UploadDocumentComponent,
    InputRadioButtonComponent,
    ActionHistoryComponent,
    // Popup criteria
    PopupCriteriaComponent
];

const COLOR = [
    ColorSketchModule,
    ColorBlockModule,
    ColorGithubModule,
    ColorCompactModule
];

const DIRECTIVES = [
    IsMobileDirective,
    IsDesktopDirective,
    IsTabletDirective
];

const PIPES = [
    DecimalPipe,
    DatePipe
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ...PRIMENG,
        ...COLOR,
        DndModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ...COMPONENTS,
        ...PRIMENG,
        ...COLOR,
        ...DIRECTIVES,
        DndModule
    ],
    entryComponents: [
    ],
    providers: [
        ...PIPES,
        TransitionService,
        AEWorkflowService,
        WorkflowService,
        DynamicFormService,
        AEStatusTypeService
    ],
})
export class SharedModule { }
