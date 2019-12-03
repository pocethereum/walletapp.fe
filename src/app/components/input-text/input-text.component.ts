import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
})
export class InputTextComponent implements OnInit {
    @Input() labelText: string = "";
    @Input() placeholder: string = "";
    constructor() { }

    ngOnInit() { }

}
