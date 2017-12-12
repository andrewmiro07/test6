import { NgModule, Component, enableProdMode, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DataService, MenuSections, Tab, Customerz } from './data.service';
import { DxDataGridModule, DxTabsModule, DxSelectBoxModule, DxCheckBoxModule, DxNumberBoxModule, DxButtonModule, DxFormModule, DxFormComponent, DxProgressBarModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {
    transform(value: number): string {
        return "00:00:" + ("0" + value).slice(-2);
    }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@NgModule({
  imports: [BrowserModule, DxDataGridModule, DxTabsModule, DxSelectBoxModule, DxCheckBoxModule, DxNumberBoxModule, DxButtonModule, DxFormModule, DxFormComponent, DxProgressBarModule],
  declarations: [AppComponent, TimePipe],
  bootstrap: [AppComponent]
})

export class AppComponent implements OnInit {
  @ViewChild(DxFormComponent) form: DxFormComponent
  title = 'app';
  _counter: number;
  someProperty = '';
  textValue: string = '0';
  textValue1: string;
  sections: MenuSections[];
  customers: any[];
  tabs: Tab[];
  tabContent: string;
  tabId: number = 0;
  password = "";
  passwordOptions: any = {
    mode: "password",
    value: this.password
  };
  customer: Customerz;
  countries: string[];
  maxDate: Date = new Date();
  cityPattern = "^[^0-9]+$";
  namePattern: any = /^[^0-9]+$/;
  phonePattern: any = /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/;
  phoneRules: any = {
    X: /[02-9]/
  }
  buttonText = "Start progress";
  inProgress = false;
  seconds = 10;
  maxValue = 10;
  intervalId: number;

  constructor(private dataService: DataService) {
    this.tabs = dataService.getTabs();
    this.tabContent = this.tabs[0].content;
    this.customers = this.dataService.getCustomers();
    this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
    this.countries = dataService.getCountries();
    this.customer = dataService.getCustomer();
  }

  selectTab(e) {
    this.tabContent = this.tabs[e.itemIndex].content;
    this.tabId = this.tabs[e.itemIndex].id;
    this.textValue = this.tabId.toString();
  }

  setCounter(num: number) {
    this.textValue1 = this.textValue;
    this.textValue = num.toString();
  }

  ngOnInit() {
    this.sections = this.dataService.getSections();
  }

  passwordComparison = () => {
    return this.form.instance.option("formData").Password;
  };
  checkComparison() {
    return true;
  }

  onFormSubmit = function (e) {
    notify({
      message: "You have submitted the form",
      position: {
        my: "center top",
        at: "center top"
      }
    }, "success", 3000);

    e.preventDefault();
  }

  onButtonClick() {
    if (this.inProgress) {
      this.buttonText = "Continue progress";
      clearInterval(this.intervalId);
    } else {
      this.buttonText = "Stop progress";

      if (this.seconds === 0) {
        this.seconds = 10;
      }

      this.intervalId = window.setInterval(() => this.timer(), 1000);
    }
    this.inProgress = !this.inProgress;
  }

  timer() {
    this.seconds--;
    if (this.seconds == 0) {
      this.buttonText = "Restart progress";
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
      return;
    }
  }

  format(value) {
    return 'Loading: ' + value * 100 + '%';
  }
}
