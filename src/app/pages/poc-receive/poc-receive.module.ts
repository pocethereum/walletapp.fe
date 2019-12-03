import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PocReceivePage } from './poc-receive.page';
import { ComponentsModule } from '../../components/components.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PocReceivePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgxQRCodeModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PocReceivePage]
})
export class PocReceivePageModule { }
