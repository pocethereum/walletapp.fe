import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PocSendPage } from './poc-send.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PocSendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PocSendPage]
})
export class PocSendPageModule { }
