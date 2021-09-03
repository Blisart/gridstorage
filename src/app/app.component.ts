import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { Column, Options } from 'devextreme/ui/data_grid';
import ODataStore from 'devextreme/data/odata/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'projwithbugs';

  private engis: any[] =  [
    { Id: 1, Name: 'John'},
    { Id: 2, Name: 'Max'},
    { Id: 9, Name: 'james'},
    { Id: 18, Name: 'Bob'},
    { Id: 19, Name: '000. Unknown'},
    { Id: 35, Name: 'Pete'},
    { Id: 36, Name: 'Patrick'},
  ]

  @ViewChild(DxDataGridComponent, {static: false}) grid!: DxDataGridComponent;

  dataSource: DataSource;
  options: Options | any;

  constructor() {

    const columns: Column[] = [
      {
        caption: 'Engineer',
        name: '_product_Engineer_Name',
        dataField: 'Product_Engineer_ID',
        calculateSortValue: (data) => {
          return data._product_Engineer_Name
        },
        sortingMethod: (a, b) => {
          console.log(a ,b); // expected engis names
          return a - b;
        },
        lookup: {
          dataSource: {
            store: new CustomStore({
              key: 'Id',
              load: () => {
                return this.engis;
              }
            })
          },
          displayExpr: 'Name',
          valueExpr: 'Id',
        }
      },
      {
        caption: 'Product Category',
        dataField: 'Product_Category',
      },
      {
        caption: 'Product Cost',
        dataField: 'Product_Cost',
      },
    ]

    this.options = {
      paging: { enabled: true, pageSize: 25},
      pager: { allowedPageSizes: [25, 50, 75, 100], showPageSizeSelector: true, showInfo: true, visible: true},
      columnChooser: { enabled: true, mode: 'select', },
      searchPanel: { visible: true, width: 200 },
      stateStoring: { enabled: true, type: 'localStorage', storageKey: 'gridStorage' },
      activeStateEnabled: true,
      hoverStateEnabled: true,
      showColumnLines: false,
      showRowLines: false,
      showBorders: false,
      rowAlternationEnabled: true,
      loadPanel: { enabled: true },
      grouping: {texts: {groupContinuedMessage: null, groupContinuesMessage: null}},
      summary: {
        skipEmptyValues: false,
        groupItems: [{
          displayFormat: 'Count: {0}',
        }],
      },
      columns,
      allowColumnReordering: true,
      groupPanel: {allowColumnDragging: true, visible: true},
      filterRow: { visible: true },
    };

    this.dataSource = new DataSource({
      store: new ODataStore({
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
        key: 'Product_ID',
        onLoaded: (data: any) => {
          return data.map((item: any) => {
            const engi = this.engis.find(engi => engi.Id === item.Product_Engineer_ID)
            item._product_Engineer_Name = engi ? engi.Name : null;
          })
        }
      })
    });
  }

  ngAfterViewInit(): void {
    Object.keys(this.options).forEach(key => {
      this.grid.instance.option(key, this.options[key]);
    });
  }
}
