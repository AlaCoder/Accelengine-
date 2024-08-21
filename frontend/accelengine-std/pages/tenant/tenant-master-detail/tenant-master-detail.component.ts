import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Components
import { CriteriaComponent } from '@app/accelengine-shared/components/criteria/criteria.component';
import { AEList, HybrideComponent } from 'accelengine-lib';

// Models
import { Tenant } from '@app/accelengine-core/models/tenant.model';
import { TreeNode } from 'primeng/api';

// Services
import { TenantService } from '@app/accelengine-std/services/tenant.service';
import { TreeNodeBuilderService } from '@app/accelengine-core/services/tree-node-builder.service';
import { TreeDragDropService } from 'primeng/api';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { Logger } from 'accelengine-lib';
import { cloneDeep } from "lodash";

const log = new Logger('TenantMasterDetailComponent');

@Component({
  selector: 'app-tenant-master-detail',
  templateUrl: './tenant-master-detail.component.html',
  styleUrls: ['./tenant-master-detail.component.scss'],
  animations: APP_CONFIG.app.animations,
  providers: [TreeDragDropService]
})
export class TenantMasterDetailComponent extends HybrideComponent<Tenant> implements OnInit {

  trees: TreeNode[] = [];
  allTenants: Tenant[] = [];
  tenants: Tenant[] = [];
  isDefaultTenant: boolean = false;

  constructor(
    injector: Injector,
    private tenantService: TenantService,
    private treeNodeBuilderService: TreeNodeBuilderService<Tenant>
  ) {
    super(injector, Tenant, tenantService, CriteriaComponent);
    this.criteria = false;

    // UI Customized Form Validation
    this.formGroup = this.formBuilder.group({
      id: [this.selectedData.id],
      code: [this.selectedData.code, [Validators.required]],
      name: [this.selectedData.name, [Validators.required]],
      parentTenant: [this.selectedData.parentTenant, [Validators.required]]
    });
  }

  ngOnInit(): void {
    log.debug('ngOnInit');
    this.initUI();
    this.initData();
  }

  // Init
  initUI() {
    // Do not remove
    super.initUI();
    log.debug('Init UI');
  }

  initData() {
    // Do not remove
    log.debug('Init Data');
    this.subscriptions.push(this.tenantService.getAllTreesOfTenants().subscribe((res) => {
      this.trees = [];
      if (res) {
        res.forEach((root) => {
          this.trees.push(this.treeNodeBuilderService.toTreeNode(root));
        });
        this.treeNodeBuilderService.expandAll(this.trees);
      }
    }));
    this.subscriptions.push(this.tenantService.getAllActivate().subscribe((res: AEList<Tenant>) => {
      this.trees = [];
      if (res) {
        this.allTenants = res.datas;
        this.tenants = [...this.allTenants];
      }
    }));
  }

  onDrop(event): void {
    if (!event.dragNode.parent || (event.dragNode.parent && event.dragNode.parent.data.id !== event.dropNode.data.id)) {
      let dragNode: Tenant = event.dragNode.data;
      let dropNode: Tenant = event.dropNode.data;
      this.confirmationService.confirm({
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        message: "Veuillez confirmer ce changement structurel ?",
        acceptLabel: "Oui",
        rejectLabel: "Non",
        accept: () => {
          event.accept();
          dropNode.children = null;
          dragNode.children = null;
          dragNode.parentTenant = dropNode;
          this.subscriptions.push(this.tenantService.update(dragNode.id, dragNode).subscribe((res: Tenant) => {
            this.afterSaveOK();
          }));
        }
      });
    }
  }

  onNodeSelect(node: Tenant) {
    this.treeNodeBuilderService.expandOne(this.trees, node);
    let row = { ...node } as Tenant;
    this.isDefaultTenant = row.code === APP_CONFIG.tenant.default;
    if (this.isDefaultTenant) {
      this.formGroup.get("parentTenant").removeValidators(Validators.required);
    } else {
      this.formGroup.get("parentTenant").addValidators(Validators.required);
    }
    this.formGroup.get("parentTenant").updateValueAndValidity();
    this.editMode(false);
    this.canDeleteCopy = true;
    if (this.isMasterExpanded) {
      this.isMasterExpanded = !this.isMasterExpanded;
    }
    this.selectedData = cloneDeep(row);
    this.selectedData.parentTenant = this.allTenants.find((e: Tenant) => e.code === this.selectedData.code).parentTenant;
    this.formGroup.patchValue(this.selectedData);
    if (!this.isDefaultTenant) {
      this.subscriptions.push(this.tenantService.getPossibleParentList(this.selectedData.id)
        .subscribe((result: Tenant[]) => {
          if (result) {
            this.tenants = [...result];
          }
        }));
    }
    this.afterDblclickRow();
  }

  onAddNodeClick(treeNode: TreeNode): void {
    this.onAddClick();
    this.isDefaultTenant = false;
    let data: Tenant = treeNode.data;
    this.selectedData = { parentTenant: data } as Tenant;
    this.tenants = [data];
    this.formGroup.get("parentTenant").patchValue(data);
    setTimeout(() => {
      this.formGroup.get("parentTenant").disable();
    });
  }

  editMode(activeEdit) {
    this.isEdit = activeEdit;
    this.menuSaveService.showSave.next(activeEdit);
    this.menuSaveService.isValide.next(activeEdit);
    this.canDeleteCopy = false;
    this.canDeleteCopyChild = false;
    if (activeEdit) {
      this.isMasterExpanded = false;
    }
    else {
      this.selectedChildData = {};
      this.isMasterExpanded = true;
      this.isSubmitted = false;
      this.mainTab = true;
    }
  }

  onAddClick(): void {
    this.isDefaultTenant = false;
    this.tenants = [...this.allTenants];
    this.formGroup.get("parentTenant").enable();
    this.formGroup.get("parentTenant").addValidators(Validators.required);
    this.formGroup.get("parentTenant").updateValueAndValidity();
    super.onAddClick();
  }

  onDeleteClick(): void {
    if (this.isDefaultTenant) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de supprimer le tenant par défaut",
        life: 5000
      });
      return;
    }
    log.debug('Delete Click');
    const subscribe = this.confirmPopup(this.delete_label, 'fas fa-exclamation-triangle', this.delete_confirmation + "<br><strong> Attention, Les tenants fils seront également supprimés</strong>").subscribe(result => {
      if (result) {
        log.debug('Delete confirmed');
        this.tenantService.delete(this.selectedData['id']).subscribe(result => {
          // Do not remove
          if (result) {
            this.afterDeleteOK();
          }
        });
      }
    });
    this.subscriptions.push(subscribe);
  }
}
