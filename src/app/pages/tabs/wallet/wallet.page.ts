import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Web3Service } from '../../../providers/web3/web3.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpService } from "../../../providers/http/http.service";
import { NativeService } from '../../../providers/native/native.service';
import { Events, NavController } from '@ionic/angular';
import { NgZone } from "@angular/core";

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
    ifShowAlert = false;
    ifShowWalletList = false;
    wallet: any = {};
    amount = 0;
    amountInOther: any = '';
    amountInOtherInterger: any = '';
    amountInOtherFraction: any = '';
    amountInOtherDisplay: any = '';
    alertTitle = "";
    alertDesc = "";

    ifShowPasswordPrompt = false;
    cancelPrompt = null;
    confirmPrompt = null;


    constructor(
        private router: Router,
        private helper: HelperService,
        public global: GlobalService,
        private web3: Web3Service,
        private http: HttpService,
        private storage: Storage,
        private native: NativeService,
        private events: Events,
        private zone: NgZone,
    ) {
        console.log("Wallet constructor...");
    }

    ngOnInit() {
        console.log("Wallet ngoninit..");
    }

    async ionViewDidEnter() {
        console.log("wallet ngoninit +++++++++...");
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex || 0] || {};
        console.log(this.wallet)
        this.computeValue();
    }

    async computeValue() {
        await this.getWalletInfo(this.wallet.addr);
        //获取汇率信息
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            console.log("汇率：", res.rates);
            let unit = this.global.settings.valueUnit || "USD";

            let value = res.rates.find(item => item.currency == unit);
            if (!value) {
                value = res.rates[0];
            }
            this.global.selectedRate = value;
            //计算当前金额的估算
            this.amountInOther = this.amount * value.rate;
            this.amountInOtherInterger = Math.floor(this.amountInOther);
            let mod = Math.floor(Math.pow(10, value.significand));
            let amountInOtherFraction: any = Math.floor(this.amountInOther * mod) % mod;
            amountInOtherFraction = amountInOtherFraction + "";
            while (amountInOtherFraction.length < value.significand) {
                amountInOtherFraction = amountInOtherFraction + '0';
            }
            this.amountInOtherFraction = amountInOtherFraction;
            this.amountInOtherDisplay = this.amountInOtherInterger + '.' + this.amountInOtherFraction;
        })
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    scan() {
        this.native.scan().then((res: any) => {
            console.log("scan succeed。。。" + JSON.stringify(res));
            // this.handleText(res.text);
            this.helper.handleText(res.text, (url, method) => {
                if (method == 'import') {
                    this.ifShowPasswordPrompt = true;
                    this.cancelPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                    };
                    this.confirmPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                        //密码校验成功,开始传输keystore
                        setTimeout(() => {
                            this.http.post(url, {
                                keystore: this.wallet.keystore
                            }, {
                                ignoreError: true
                            }).subscribe(res => {
                                console.log("keystore transfered：" + res);
                            })
                        }, 100);
                    };
                } else if (method == 'transfer') {
                    let navigationExtras: NavigationExtras = {
                        state: {
                            address: url,
                        }
                    };
                    this.router.navigate(['poc-send'], navigationExtras);
                }
            })
        })
    }

    goPocSend() {
        this.router.navigate(['poc-send']);
    }

    goPocReceive() {
        this.router.navigate(['poc-receive']);
    }

    confirmCallback() {
        this.ifShowAlert = false;
    }

    addWallet() {
        this.ifShowWalletList = false;
        this.router.navigate(['wallet-create']);
    }

    showWalletList() {
        this.ifShowWalletList = true;
    }

    closeWalletDialog() {
        this.ifShowWalletList = false;
    }

    goWalletDetail() {
        this.router.navigate(['wallet-detail']);
    }

    async copyAddr() {
        console.log("开始拷贝钱包地址....");
        let wallet = 'Poc' + this.wallet.addr.replace('0x', '');
        console.log("Addr:" + wallet);
        this.native.copy(wallet);
        let message = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(message);
    }

    async getWalletInfo(addr) {
        this.amount = await this.web3.getPocBalance(addr);
        // this.web3.getPocBalance(addr);
    }

    toggleWallet(index, wallet) {
        this.ifShowWalletList = false;
        if (this.wallet.name != wallet.name) {
            this.global.currentWalletIndex = index;
            this.storage.set('localwalletindex', this.global.currentWalletIndex);
            this.wallet = wallet;
            // this.global.currentWallet = wallet;
            this.computeValue();
        }
    }
}
