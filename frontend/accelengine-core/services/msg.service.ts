import { Injectable, Injector } from '@angular/core';

// Models

// Services
import { Message, MessageService } from 'primeng/api';

// Helper

@Injectable({ providedIn: 'root' })
export class MsgService {
    constructor(private messageService: MessageService) {
    }

    public showInfoMessage(summary: string, detail: string) {
        this.showMessage({ severity: 'info', sticky: true, summary: summary, detail: detail });
    }

    public showWarnMessage(summary: string, detail: string) {
        this.showMessage({ severity: 'warn', sticky: true, summary: summary, detail: detail });
    }

    public showErrorMessage(summary: string, detail: string) {
        this.showMessage({ severity: 'error', sticky: true, summary: summary, detail: detail });
    }

    public showSuccessMessage(summary: string, detail: string) {
        this.showMessage({ severity: 'success', sticky: true, summary: summary, detail: detail });
    }

    private showMessage(message: Message) {
        this.messageService.add(message);
    }
}
