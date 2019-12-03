import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExportPrivatekeyPage } from './export-privatekey.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ExportPrivatekeyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExportPrivatekeyPage]
})
export class ExportPrivatekeyPageModule { }
