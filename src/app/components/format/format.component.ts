import {Component, OnInit} from '@angular/core';
import {FormatService} from '../../services/format/format.service';
import {Router} from '@angular/router';
import {Format} from '../../interfaces/format';

@Component({
    selector: 'app-format',
    templateUrl: './format.component.html',
    styleUrls: ['./format.component.css']
})
export class FormatComponent implements OnInit {

    formats = [];
    format = {} as Format;

    constructor(
        private formatService: FormatService,
        private router: Router) {
    }

    ngOnInit() {
        this.formatService.getFormats().subscribe(
            res => this.formats = res,
            error => console.log(error)
        );
    }

    add() {
        this.formatService.addFormat(this.format);
        this.format = {} as Format;
    }

    delete(event, format) {
        this.formatService.deleteFormat(format.id);
    }
}
