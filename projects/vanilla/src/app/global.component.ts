import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'sq-global',
  template: `<i class="fas fa-paint-brush fa-3x"></i>`,
  encapsulation: ViewEncapsulation.None,
  styles: [`
  div:not(.uib-configurable) sq-global {
    display: none;
  }
  `]
})
export class GlobalComponent implements OnChanges {
  @Input() backgroundColor?: string;
  @Input() gradientColor?: string;
  @Input() backgroundImage?: string;
  @Input() fontFamily?: string;


  ngOnChanges(changes: SimpleChanges): void {
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundSize = '';
    if(this.fontFamily) {
      document.documentElement.style.setProperty('--bs-body-font-family', this.fontFamily);
    }
    else {
      document.documentElement.style.removeProperty("--bs-body-font-family");
    }
    if(this.backgroundImage) {
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundPosition = '50%';
      document.body.style.backgroundSize = 'cover';
    }
    else if(this.backgroundColor) {
      if(this.gradientColor) {
        document.body.style.backgroundImage = `linear-gradient(${this.backgroundColor},${this.gradientColor})`;
        document.body.style.backgroundAttachment = 'fixed';
      }
      else {
        document.body.style.backgroundColor = this.backgroundColor;
      }
    }
  }
}
