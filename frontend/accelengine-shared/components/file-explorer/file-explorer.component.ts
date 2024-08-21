import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

// Models
import { TreeNode } from 'primeng/api';

// Components
import { BaseComponent } from 'accelengine-lib';

// Services
import { FileExplorerService } from '@app/accelengine-std/services/file-explorer.service';

// Helpers
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent extends BaseComponent implements OnChanges {

  @Input() path: string;

  selectedNode: TreeNode;

  nodes: TreeNode[] = [];

  constructor(private injector: Injector, private fileExplorerService: FileExplorerService) {
    super(injector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["path"].currentValue) {
      this.subscriptions.push(this.fileExplorerService.getTreeByPath(this.path).subscribe((res: TreeNode) => {
        this.nodes = [res];
      }));
    }
  }

  downloadFile(): void {
    if (this.selectedNode && this.selectedNode.icon === "pi pi-folder") {
      this.confirmationService.confirm({
        header: "Confirmer le téléchargement",
        icon: "pi pi-exclamation-triangle",
        message: "Veuillez compresser dans " + this.selectedNode.label + ".zip ?",
        acceptLabel: "Oui",
        rejectLabel: "Non",
        accept: () => {
          this.download();
        }
      });
    } else {
      this.download();
    }
  }

  download(): void {
    this.subscriptions.push(this.fileExplorerService.downloadFile(this.selectedNode.data).subscribe((res: HttpResponse<Blob>) => {
      if (res && res.ok) {
        saveAs(res.body, this.selectedNode.label);
      }
    }));
  }

  nodeSelect(event) {

  }

  nodeUnselect(event) {

  }
}
