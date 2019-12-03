import { NgModule } from '@angular/core';
import { AddPocEllipsisPipe } from "./add-poc-ellipsis/add-poc-ellipsis.pipe";
import { CoinDisplayPipe } from './coin-display/coin-display.pipe';
import { TimeDisplayPipe } from './time-display/time-display.pipe';

@NgModule({
	declarations: [AddPocEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe],
	imports: [],
	exports: [AddPocEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe]
})
export class PipesModule { }
