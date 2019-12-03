import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from "../../providers/web3/web3.service";
import { NativeService } from "../../providers/native/native.service";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-transaction-result',
    templateUrl: './transaction-result.page.html',
    styleUrls: ['./transaction-result.page.scss'],
})
export class TransactionResultPage implements OnInit {
    status = 0;
    tx = "";
    detail: any = {};
    miningFee: any = '';
    time = '';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private web3: Web3Service,
        private native: NativeService
    ) {
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
            this.status = state.status || 0;
            this.tx = state.tx || "";
            this.time = state.time || Date.now();

            if (this.tx) {
                this.getDetailByTx();
            }
        }
    }

    async getDetailByTx() {
        //查询交易信息
        this.detail = await this.web3.getTxDetail(this.tx);
        console.log("Transaction detail：" + JSON.stringify(this.detail));
        this.miningFee = this.detail.gas * this.detail.gasPrice;
        this.detail.from = this.detail.from.replace(/^0x/, 'poc');
        this.detail.to = this.detail.to.replace(/^0x/, 'poc');
    }

    goHashPage() {
        if (this.status != 1) {
            let url = "http://scan.poc.com/#/txhash/" + this.tx;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goHash(hash) {
        if (this.status != 1) {
            let url = "http://scan.poc.com/#/txhash/" + this.tx;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goAddress(addr) {
        if (this.status != 1) {
            let url = "http://scan.poc.com/#/address/" + addr;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    goHeight(height) {
        if (this.status != 1) {
            let url = "http://scan.poc.com/#/block/" + height;
            this.native.openUrlBySystemBrowser(url);
        }
    }

    ngOnInit() {

    }


}
