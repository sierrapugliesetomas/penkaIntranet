import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterCodeTemplate'
})
export class FilterCodeTemplatePipe implements PipeTransform {

    transform(items: Array<any>, codeTemplate: string): any {
        return items.filter(item => item.codeTemplate === codeTemplate);
    }
}
