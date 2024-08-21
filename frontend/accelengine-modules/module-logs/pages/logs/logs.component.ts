  import { Component, Injector, OnChanges, OnInit, SimpleChanges } from "@angular/core";
  import { Setting } from "@app/accelengine-std/models/application.model";
  import { DictionaryType } from "@std/models/dictionaryType.model";
  import { DictionaryValue } from "@std/models/dictionaryValue.model";
  import { BaseComponent } from "accelengine-lib";
  import { SettingService } from "@app/accelengine-std/services/setting.service";
  import { DictionaryTypeService } from "@std/services/dictionary-type.service";
  import { Logger } from "accelengine-lib";
  import { LogService } from './log-file.service';
import { FileExplorerComponent } from "@app/accelengine-shared/components/file-explorer/file-explorer.component";
import { FileExplorerService } from "./file-explorer.service";
import { TreeNode } from "primeng/api";
import * as saveAs from "file-saver";
import { HttpResponse } from "@angular/common/http";

  const log = new Logger("LogsComponent");

  @Component({
      selector: "app-log",
      templateUrl: "logs.component.html",
  })
  export class LogsComponent extends BaseComponent implements OnInit,OnChanges {
    selectedNode: TreeNode;
    nodes : TreeNode[] = [];
      logDirPath: string;
      batchPath:string;
      batchDirPath: string;
      //  dictionarie: { dictionary: DictionaryType, values: DictionaryValue[] }[] = [];
      dictionaryValues: DictionaryValue[] = [];
      dictionarietype: DictionaryType[] = [];
      batchNodes: TreeNode<any>[];
      logNodes: TreeNode<any>[];
      Values: any[] = []; // Initialize Values as an empty array
      logPath: any;
      constructor(
          private injector: Injector,
          //private settingService: SettingService,
          private dictionaryTypeService: DictionaryTypeService,
          private fileExplorerService: FileExplorerService
      ) {
          super(injector);
      }
      ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["batchDirPath"].currentValue) {
          this.subscriptions.push(this.fileExplorerService.getTreeByPath(this.batchDirPath).subscribe((res: TreeNode) => {
            this.nodes = [res];
            console.log(this.batchDirPath);
            
          }));
        }
      }
      ngOnInit(): void {
        //   this.subscriptions.push(
        //       this.settingService
        //           .getByCode("LOG_DIR_PATH")
        //           .subscribe((setting: Setting) => {
        //               if (setting) {

        //                   this.logDirPath = setting.valueString;
        //                   this.batchDirPath=this.logDirPath+"\\batch";
        //                 this.logPath=this.logDirPath+"\\pfe\\dev"
        //                   this.subscriptions.push(this.fileExplorerService.getTreeByPath(this.batchDirPath).subscribe((res: TreeNode) => {
        //                     this.batchNodes = [res];
                            
        //                   }));
        //                   this.subscriptions.push(this.fileExplorerService.getTreeByPath(this.logPath).subscribe((res: TreeNode) => {
        //                     this.logNodes = [res];
                            
        //                   }));

        //               }
        //           })
        //   );
          

          this.dictionaryTypeService.getAll().subscribe((dictionaries) => {
              if (dictionaries) {
                  this.dictionarietype = dictionaries.datas.filter(
                      (d) => d.code == "LOGS"
                  );
              }
              this.dictionaryValues = this.dictionarietype[0].dictionaryValues;
              this.dictionaryValues.forEach(element => {

                this.subscriptions.push(this.fileExplorerService.getTreeByPath(element.description).subscribe((res: TreeNode) => {
                            
                            this.Values.push({code:element.code,label:element.label,nodes:[res]})
                          }));

              });
          });
          
      }
      
    

      
  nodeSelect(event) {

  }

  nodeUnselect(event) {

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

  }
