import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'addPocEllipsis'
})
export class AddPocEllipsisPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        console.log(value)
        if (!value) {
            return '';
        }
        value = value.replace('0x', '');
        return 'Poc' + value.slice(0, 8) + '...' + value.slice(-8);
    }

}
