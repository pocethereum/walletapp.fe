import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from '../../providers/web3/web3.service';
import { NativeService } from '../../providers/native/native.service';

@Component({
    selector: 'app-poc-send',
    templateUrl: './poc-send.page.html',
    styleUrls: ['./poc-send.page.scss'],
})
export class PocSendPage implements OnInit {
    range = 25;
    wallet: any = {};
    amount = 0;
    receiveAddress = "";
    payAmount: any = "";
    min = 1;
    max = 100;
    amountError = "";
    addressError = "";
    ifShowPasswordPrompt = false;
    ifShowAlert = false;
    alertTitle = "";
    alertDesc = "";

    constructor(
        private router: Router,
        // private clipboard: Clipboard,
        private helper: HelperService,
        private global: GlobalService,
        private storage: Storage,
        private web3: Web3Service,
        private native: NativeService
    ) { }

    async ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        console.log(this.global.gWalletList, this.global.currentWalletIndex)
        //获取余额
        this.amount = await this.web3.getPocBalance(this.wallet.addr);
        let state = this.router.getCurrentNavigation();
        if (state) {
            let obj = state.extras.state;
            this.receiveAddress = obj.address;
        }
    }

    scan() {
        this.native.scan().then(async (res: any) => {
            console.log("SCAN RESULT：", res);
            this.helper.handleText(res.text, async (url, method) => {
                if (method == 'transfer') {
                    let result = await this.web3.isPocAddr(url);
                    if (result == 0) {
                        this.receiveAddress = res;
                    } else {
                        let message = await this.helper.getTranslate('UNKNOWN_RESULT');
                        this.helper.toast(message);
                    }
                }

            })
        }, res => {
            // if (res == 1) {
            //     //临时拒绝

            // } else if (res == 0) {
            //     //永久拒绝
            //     this.ifShowAlert = true;
            //     this.alertTitle = "权限拒绝";
            //     this.alertDesc = "您已拒绝摄像头权限，请前往应用管理打开";
            // } else {
            //     this.helper.toast("扫码失败");
            // }
        })
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
    }

    confirmPrompt(privateKey) {
        console.log("Private key...", privateKey);
        this.ifShowPasswordPrompt = false;
        this.transfer(privateKey);
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    async checkAmount() {
        this.amountError = "";
        let amount = +this.payAmount;
        if (amount <= 0) {
            let message = await this.helper.getTranslate('AMOUNT_ILLEGAL');
            this.amountError = message;
            return;
        }
        console.log(`${amount}, ${this.range}, ${this.amount}`);
        if (amount + this.range * 21000 / 1000000000 > this.amount) {
            let message = await this.helper.getTranslate('BALANCE_INFFICIENT');
            this.amountError = message;
            return;
        }
    }

    async checkAddr() {
        this.addressError = "";

        let result = await this.web3.isPocAddr(this.receiveAddress.toLowerCase());
        if (result == -1) {
            let message = await this.helper.getTranslate('ADDRESS_EMPTY');
            this.addressError = message;
        } else if (result == -2) {
            let message = await this.helper.getTranslate('ADDRESS_ERROR');
            this.addressError = message;
        }
    }

    changeRange(e) {
    }

    async transferConfirm() {
        await this.checkAmount();
        if (this.amountError) {
            return;
        }

        await this.checkAddr();
        if (this.addressError) {
            return;
        }
        //引导用户输入密码
        this.ifShowPasswordPrompt = true;
    }

    async transfer(privatekey) {
        let address = this.receiveAddress.toLowerCase().replace('poc', '0x');
        this.web3.transferPoc(this.wallet.addr, address, this.payAmount, this.range, privatekey, async (err, tx) => {
            console.log("Transaction callback.......", err, tx);
            if (err === null) {
                // resolve(tx);
                // this.helper.toast("交易成功");
                let navigationExtras = {
                    state: {
                        tx: tx,
                        status: 1 //0-成功，1:打包中，2:失败
                    }
                };
                //前往交易结果页
                this.router.navigate(['transaction-result'], navigationExtras);
            } else {
                let message = await this.helper.getTranslate('TRANSACTION_FAILED');
                if (err.message.toLowerCase().indexOf('insufficient funds for gas') > -1) {
                    message = await this.helper.getTranslate('BALANCE_INFFICIENT');
                } else if (err.message.toLowerCase().indexOf('replacement transaction underpriced') > -1) {
                    message = await this.helper.getTranslate('NONCE_ERROR');
                } else {
                    message = message + ': ' + err.message;
                }
                this.helper.toast(message)
            }
        })
    }

}
