import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})

// let projectName = 'POC'
export class GlobalService {
    public gWalletList = [];
    vibrationDuration = 100;
    paymentPassword = "";
    walletName = "";
    currentWalletIndex = -1;
    maxWalletNum = 3;
    selectedRate: any = {};

    // currentWallet = {};

    static errorCode = {};
    static showLog = false;
    static projectName = "POC";

    projectName = GlobalService.projectName;

    settings: any = {
        valueUnit: 'USD',
        language: 'en'
    };

    api = {
        'getRateInfo': `/${GlobalService.projectName.toLowerCase()}/get_exchange_rate`,
        "getTransList": "/transaction/get_by_addr_and_type",
    }

    errorKey = {
        10001: 'VERIFYCODEERROR',
    }

    constructor(
        private storage: Storage
    ) { }
}
