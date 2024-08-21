import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

// Models
import { Column, ColumnType } from '@shared/components/data-table/data-table.model';
import { Notification } from '@std/models/notification.model';
import { AEList } from 'accelengine-lib';
import { Account } from '@core/models/account.model';
import { Setting } from '@std/models/application.model';

// Services
import { NotificationWebsocketService } from '@std/services/notification-websocket.service';
import { NotificationService } from '@std/services/notification.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettingService } from '@std/services/setting.service';

// Helpers
import { APP_CONFIG } from '@app/app.config';
import { BatchExecutionService } from '@app/accelengine-std/services/batch.execution.service';
import { BatchExecution } from '@app/accelengine-std/models/batch.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnChanges, OnInit, OnDestroy {

  @Input() account: Account;

  notifications: AEList<Notification>;
  visibleSidebar: boolean = false;
  styleSidebar = { width: '65%' };
  isLoadingProgressSpinner: boolean = true;
  subscriptions: Subscription[] = [];
  columnsNotifications: Column[];
  rowsPerPageOptions: number[] = null;
  page: number = 0;
  sizePage: number = 10;
  INVALID_FILE_NAME_REGEX: RegExp = /^.*\.[^\\]+$/;
  visibilitySeenNotifications: boolean = false;
  numberOfNotSeenNotifications: number = 0;
  isLoaded: boolean = false;

  constructor(private notificationService: NotificationService,
    private notificationWebsocketService: NotificationWebsocketService,
    private messageService: MessageService,
    private settingService: SettingService,
    private confirmationService: ConfirmationService,
    private batchExecutionService: BatchExecutionService,
    private router: Router) {
    this.columnsNotifications = Column.fromObjects([
      { field: 'title', header: 'Titre', width: 250 },
      { field: 'description', header: 'Description' },
      { field: 'dateTime', header: 'Date', type: ColumnType.DATETIME, format: 'DD/MM/YYYY HH:mm', width: 150 }
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.push(this.settingService.getByCode("KEY_NOTIFICATION_VISIBILITY").subscribe((setting: Setting) => {
      if (setting) {
        this.visibilitySeenNotifications = setting.valueBoolean;

        if (APP_CONFIG.QADBackend) {
          if (changes.account.currentValue?.username) {
            this.subscribeToSocketNotificationsQAD(this.account.username);
            this.getNotificationsQAD(this.account.username, this.page, this.sizePage);
          }
        }
        else {
          if (changes.account.currentValue?.id && !this.isLoaded) {
            this.isLoaded = true;
            this.subscribeToSocketNotificationsByAccountId(this.account.id);
            this.getNotifications(this.account.id, this.page, this.sizePage);
          }
        }
      }
    }));
  }

  ngOnInit(): void {
    if (APP_CONFIG.QADBackend) {
      // TODO
    }
    else {
      this.notificationWebsocketService.initConnection();
    }
    this.changeWidthSidebar(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeWidthSidebar(event.target.innerWidth);
  }

  changeWidthSidebar(width: number): void {
    this.visibleSidebar = false;
    if (width > 1200) {
      this.styleSidebar.width = '65%';
    } else {
      this.styleSidebar.width = '100%';
    }
  }

  subscribeToSocketNotificationsByAccountId(idAccount: number): void {
    setTimeout(() => {
      this.notificationWebsocketService.subscribe(`${APP_CONFIG.app.prefixNotificationsSocket}/${idAccount}`, (res) => {
        this.page = 0;
        let notification: Notification = res.body;
        this.getNotifications(this.account.id, this.page, this.sizePage);
        if (notification["deleted"] || notification.seen) {
          return;
        }
        this.notificationWebsocketService.playAudio();
        let severity: string;
        if (notification.typeNotification === "INFORMATION") {
          severity = "info";


        }
        else if (notification.typeNotification === "WARNING") {
          severity = "warn";
        } else {
          if(this.INVALID_FILE_NAME_REGEX.test(notification.link)){
            let fileName = notification.link;
            this.batchExecutionService.downloadBatchOutputFile(fileName)
              .subscribe(result => {
                if (result) {
                  var blob = new Blob([result], { type: 'application/octet-stream' });
                  var downloadURL = window.URL.createObjectURL(blob);
                  var link = document.createElement('a');
                  link.href = downloadURL;
                  link.download = fileName.substring(fileName.lastIndexOf("\\") + 1);
                  link.click();
                }
              });
          }
          severity = notification.typeNotification.toLowerCase();
        }
        this.messageService.add({
          severity: severity,
          summary: notification.title,
          detail: notification.description,
          life: 5000
        });
      });
    }, 1000);
  }

  subscribeToSocketNotificationsQAD(username: string): void {
    // TODO
  }

  onPageChanged(event): void {
    this.page = Number.parseInt(event.split(",")[0]);
    this.sizePage = Number.parseInt(event.split(",")[1]);
    this.getNotifications(this.account.id, this.page, this.sizePage);
  }

  onDblclickRow(event): void {

    if(event.typeNotification === 'SUCCESS'){
      let outputFileName;
      let outputFileContent;

      this.batchExecutionService.getByID(event.idData).subscribe(reponse => {
        const batchExcution = reponse as BatchExecution;
        outputFileName = batchExcution.outputFilePath;
        if(outputFileName !== undefined && outputFileName !== null && outputFileName != ""){
          this.batchExecutionService.getBatchOutputFile(event.idData).subscribe(result =>{
            outputFileContent = result as string;
            if(outputFileContent !== undefined && outputFileContent !== null && outputFileContent != ""){
              let blob:any = new Blob([outputFileContent], { type: 'text/json; charset=utf-8' });
              const url = window.URL.createObjectURL(blob);
              saveAs(blob, outputFileName.substring(outputFileName.lastIndexOf("\\")+1));
            }
          })
        }
      })
    }
    if(event.link && !this.INVALID_FILE_NAME_REGEX.test(event.link)){
        this.router.navigate([event.link]);
    }
    this.visibleSidebar = false;
    this.subscriptions.push(this.notificationService.markAsSeen(event, event.id).subscribe((notification: Notification) => {
      if (this.visibilitySeenNotifications) {
        let indexOfNotification: number = this.notifications.datas.findIndex((n: Notification) => n.id === notification.id);
        this.setStyle(notification);
        this.notifications.datas[indexOfNotification] = notification;
        if (this.numberOfNotSeenNotifications) {
          this.numberOfNotSeenNotifications--;
        }
      } else {
        this.getNotifications(this.account.id, this.page, this.sizePage);
      }
    }));
  }

  getNotifications(idAccount: number, page: number, size: number): void {
    setTimeout(() => {
      this.subscriptions.push(this.notificationService.numberOfNotSeenNotificationsByAccount(idAccount).subscribe((res: number) => {
        this.numberOfNotSeenNotifications = res;
      }));
      let observable: Observable<AEList<Notification>>;
      if (this.visibilitySeenNotifications) {
        observable = this.notificationService.findAllByAccountPageable(idAccount, page, size);
      } else {
        observable = this.notificationService.findAllByAccountPageableNotSeen(idAccount, page, size);
      }
      this.subscriptions.push(observable.subscribe((res: AEList<Notification>) => {
        this.notifications = res;
        this.notifications.datas.map(notification => {
          this.setStyle(notification);
        });
        this.isLoadingProgressSpinner = false;
      }));
    }, 200);
  }

  getNotificationsQAD(username: string, page: number, size: number): void {
    // TODO
    this.notifications = new AEList();
    this.notifications.datas = [];
    this.notifications.totalRecords = 0;
    this.isLoadingProgressSpinner = false;
  }

  setStyle(notification: Notification): void {
    if (!notification.seen) {
      notification["style"] = "font-weight: bold;cursor: pointer";
    } else {
      notification["style"] = "background-color: rgba(0, 0, 0, 0.15) !important; cursor: pointer";
    }
  }

  markAllAsRead(): void {
    this.confirmationService.confirm({
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      message: "Veuillez lire toutes les notifications ?",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        this.subscriptions.push(this.notificationService.markAllAsSeenByAccount(this.account.id).subscribe((res: boolean) => {
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Toutes les notifications sont marquées comme lues",
            life: 5000
          });
          this.page = 0;
          this.getNotifications(this.account.id, this.page, this.sizePage);
        }));
      }
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.notificationWebsocketService.disconnect();
    this.notificationWebsocketService.unsubscribeFromAllWebSocketEvent();
    this.isLoaded = false;
  }

}
