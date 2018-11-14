/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';

    let empList: { [key: string]: Object }[] = [];

    let listObj: DropDownList = new DropDownList({
        dataSource: empList,
        fields: { text: 'country', value: 'id' },
        noRecordsTemplate: '<div> <img src="http://www.404errorpages.com/images/image001.png" height="150px", width="150px"/> <div> There is no records to rendering the list items</div></div>',
        width: '250px',
        popupHeight: '300px',
        popupWidth: '250px',
    });
    listObj.appendTo('#list');