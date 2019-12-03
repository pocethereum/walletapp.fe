import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { Platform, NavController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/native/native.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    name = "";
    version = "";
    packageName = "";
    constructor(
        private router: Router,
        private global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        private platform: Platform,
        private native: NativeService,
        public activeRouter: ActivatedRoute,
    ) { }

    ngOnInit() {
        if (this.platform.is('cordova')) {
            this.native.getAppVersionInfo().subscribe(res => {
                console.log("Get version：" + JSON.stringify(res));
                this.version = res.versionNumber;
                this.name = res.name;
                this.packageName = res.packageName;
            })
        } else {
            this.version = '1.0.0';
            this.packageName = "com.poc.www";
            this.name = "POC";
        }
    }

    update() {
        if (this.platform.is('android')) {
            window.open(`market://details?id=${this.packageName}`, '_system');
        } else {
            window.open(`https://itunes.apple.com/cn/app/id1466591583?mt=8`);
        }
    }
}
