import { Component, OnInit } from '@angular/core';
import * as qrcode from "qrcode-generator";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-poc-receive',
    templateUrl: './poc-receive.page.html',
    styleUrls: ['./poc-receive.page.scss'],
})
export class PocReceivePage implements OnInit {
    qrcode = "";
    wallet: any = "";
    addr = '';

    constructor(
        private router: Router,
        private clipboard: Clipboard,
        private helper: HelperService,
        public global: GlobalService,
        private storage: Storage,
    ) { }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.makeQrcode();
    }

    async copyAddr() {
        this.clipboard.copy(this.addr);
        let error = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(error);
    }

    makeQrcode() {
        // var qr = qrcode(16, "L");
        let addr = this.helper.convertAddr(this.wallet.addr);
        this.addr = addr;
        this.qrcode = "poc://account/transfer/" + this.wallet.addr;
        // this.addr = addr;
        // qr.addData(addr);
        // qr.make();
        // this.qrcode = qr.createImgTag();
    }

}
