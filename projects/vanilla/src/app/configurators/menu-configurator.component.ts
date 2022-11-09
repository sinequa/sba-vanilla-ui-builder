import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-menu-configurator',
  template: `
  <div class="form-check mb-2">
    <input class="form-check-input" type="checkbox" id="right-aligned" [(ngModel)]="rightAligned">
    <label class="form-check-label" for="right-aligned">Right aligned</label>
  </div>
  `
})
export class MenuConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;

  get config(): ComponentConfig {
    return this.context.config;
  }

  get rightAligned(): boolean {
    return this.classes?.includes("navbar-right");
  }

  set rightAligned(val: boolean) {
    const c = this.classes;
    if(val) {
      c.push("navbar-right");
    }
    else {
      let i = c.indexOf("navbar-right");
      if(i === -1) return;
      c.splice(i, 1);
    }
    this.config.classes = c.join(' ');
    this.context.configChanged();
  }

  get classes(): string[] {
    return this.config.classes?.split(' ') || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.config.classes) {
      this.config.classes = "navbar-nav";
    }
  }

}
