import { Injectable } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { GlobalService } from "./global.service";
import { Title } from "@angular/platform-browser";
import { IntlService } from "@sinequa/core/intl";


@Injectable()
export class VanillaTitleStrategy extends TitleStrategy {

  constructor(
    private readonly title: Title,
    private readonly intlService: IntlService,
    private globalService: GlobalService) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    if (Boolean(this.globalService.appName)) {
      this.globalService.setTitle();
    } else {
      this.title.setTitle(this.intlService.formatMessage("msg#app.name"))
    }
  }
}
