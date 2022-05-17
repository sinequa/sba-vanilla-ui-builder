import { Injectable } from '@angular/core';
import { UserSettingsWebService } from '@sinequa/core/web-services';
import { ComponentConfig, ConfigService, ToastService } from '@sinequa/ngx-ui-builder';
import { Subscription } from 'rxjs';
import { debounceTime, skip, switchMap } from 'rxjs/operators';
import { VANILLA_BUILDER_DEFAULT_CONFIG } from '../config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  sub?: Subscription;

  constructor(
    public userSettingsService: UserSettingsWebService,
    public configService: ConfigService,
    public toastService: ToastService
  ) {

    // using userSettingsService.events observable don't works when we land in the home page first
    this.userSettingsService.events
      .subscribe(_ => {
        if (!this.sub) {
          this.setInitalConfiguration();
          this.configServiceSubscription();
        }
      });
  }

  reset() {
    this.configService.set(this.getDefaultConfig());
  }

  private setInitalConfiguration() {
    let config: ComponentConfig[];
    if(this.userSettingsService.userSettings?.['ui-builder']?.find(c => c.type === '_container')) {
      config = this.userSettingsService.userSettings?.['ui-builder'];
    }
    else {
      config = this.getDefaultConfig();
    }
    this.configService.init(config);
  }

  private configServiceSubscription() {
    this.sub = this.configService
      .watchAllConfig()
      .pipe(
        debounceTime(3000),
        skip(1), // Skip the first save corresponding to initialization
        switchMap((config) => this.userSettingsService.patch({ 'ui-builder': config }))
      )
      .subscribe(value => {
        this.toastService.info('UI configuration saved.');
      });
  }

  getDefaultConfig() {
    return [...VANILLA_BUILDER_DEFAULT_CONFIG];
  }

}
