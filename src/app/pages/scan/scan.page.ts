import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';


@Component({
    selector: 'app-scan',
    templateUrl: './scan.page.html',
    styleUrls: ['./scan.page.scss'],
})

export class ScanPage implements OnInit {
    light: boolean = false; // 判断闪光灯
    isShow: boolean = false; // 控制显示背景，避免切换页面卡顿
    showIcon = false;

    ifShowAlert = false;
    alertTitle: string;
    alertDesc: string;
    alertCancelText: string;
    alertConfirmText: string;
    confirmAlert: any;
    cancelAlert: any;

    constructor(
        private navCtrl: NavController,
        private events: Events,
        // private global: GlobalProvider,
        private openSetting: OpenNativeSettings,
        private qrScanner: QRScanner) {
    }

    ngOnInit() {
        this.qrScanner.prepare().then((status: QRScannerStatus) => {
            if (status.authorized) { // 判断是否有摄像头权限
                let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                    this.events.publish('qrscanner:result', text);
                    scanSub.unsubscribe();
                    this.ifShowAlert = false;
                    setTimeout(() => {
                        this.navCtrl.pop();
                    }, 100);
                });
                // 打开摄像头
                this.qrScanner.show();
            } else if (status.denied) {
                this.permisionPopUp();
                // this.nativeService.alert('没有权限', '没有摄像头权限，请前往设置中开启', () => {
                // this.qrScanner.openSettings();
                // });
            } else {
                this.permisionPopUp();
                // this.nativeService.alert('没有权限', '没有摄像头权限，请前往设置中开启', () => {
                // this.qrScanner.openSettings();
                // });
            }
        }).catch((e: any) => {
            console.log("catch.........")
            this.permisionPopUp();
        });
    }

    permisionPopUp() {
        this.createAlert("权限申请", "扫码需要获取摄像头权限", "取消", "同意", () => {
            this.navCtrl.pop();
        }, () => {
            this.navCtrl.pop();
            this.qrScanner.openSettings();
            // this.openSetting.open('application_details');
        });
        // let promises = [
        //     this.global.getTranslate('PERMISIONCAMERA'),
        //     this.global.getTranslate("GETPERMISIONCAMERA"),
        //     this.global.getTranslate("DENY"),
        //     this.global.getTranslate("ALLOW")
        // ];
        // Promise.all(promises)
        //     .then((text: any) => {
        //         this.createAlert(text[0], text[1], text[2], text[3], () => {
        //             console.log("用户拒绝授予权限");
        //             this.navCtrl.pop();
        //         }, () => {
        //             console.log("用户同意授予权限")
        //             this.navCtrl.pop();
        //             this.qrScanner.openSettings();
        //             // this.openSetting.open('application_details');
        //         });
        //     })
    }

    createAlert(title, message, cancelText: any = '', confirmText: any = '', cancelAlert = null, confirmAlert = () => { }) {
        this.alertTitle = title;
        this.alertDesc = message;
        this.alertCancelText = cancelText;
        this.alertConfirmText = confirmText;
        this.confirmAlert = () => {
            confirmAlert();
            this.closeAlert();
        };
        this.cancelAlert = () => {
            this.closeAlert();
            cancelAlert();
        }
        this.ifShowAlert = true;
    }

    closeAlert() {
        this.ifShowAlert = false;
    }

    ionViewWillEnter() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView'); // tslint:disable-line
        this.isShow = true; // 显示背景
        this.showIcon = true;
    }

    ionViewWillLeave() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView'); // tslint:disable-line
        this.qrScanner.hide(); // 需要关闭扫描，否则相机一直开着
        this.qrScanner.destroy(); // 关闭
        this.showIcon = false;
        this.events.unsubscribe('qrscanner:result'); // 退出页面取消所有订阅，进入页面前需订阅
    }

    // 开关手电筒
    toggleLight() {
        this.light ? this.qrScanner.disableLight() : this.qrScanner.enableLight();
        this.light = !this.light;
    }

    // 取消扫描
    close() {
        this.navCtrl.pop();
    }

}