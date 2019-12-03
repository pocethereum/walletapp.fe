import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpService } from "../../../providers/http/http.service";

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
    displayValue: any = {};
    rateList = [];
    constructor(
        private router: Router,
        public global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private http: HttpService,
        public activeRouter: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            let unit = this.global.settings.valueUnit;
            this.rateList = res.rates;
        })
    }

    getCurrency() {
        if (this.rateList.length > 0) {
            let unit = this.global.settings.valueUnit;
            let value = this.rateList.find(item => item.currency == unit);
            if (!value) {
                value = this.rateList[0];
            }
            return value;
        } else {
            return {
                symbol: "$",
                currency: "USD"
            }
        }
    }

    goSetValueUnitPage() {
        this.router.navigate(['value-unit']);
    }

    goSetLanguagePage() {
        this.router.navigate(['language-toggle']);
    }

    goAboutPage() {
        this.router.navigate(['about']);
    }

    goBrowser() {
        window.open('http://scan.poc.com');
    }

    goWalletToolPage() {
        this.router.navigate(['wallet-admin']);
    }

    goChangePassword() {
        this.router.navigate(['change-password']);
    }

}
