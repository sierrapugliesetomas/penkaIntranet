import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPublish'
})
export class FilterPublishPipe implements PipeTransform {

    transform(items: Array<any>, publish: boolean): any {
        return items.filter(item => item.publish === publish);
    }

}
