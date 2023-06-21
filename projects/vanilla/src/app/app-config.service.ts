import { Injectable } from '@angular/core';
import { UserSettingsWebService } from '@sinequa/core/web-services';
import { ComponentConfig, ConfigService, ToastService } from '@sinequa/ngx-ui-builder';
import { Subscription } from 'rxjs';
import { debounceTime, skip, switchMap } from 'rxjs/operators';
import { GLOBAL_CONFIG, VANILLA_BUILDER_DEFAULT_CONFIG } from '../config';
import { GlobalService } from './configurators/app-configuration/global.service';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  sub?: Subscription;

  constructor(
    private readonly userSettingsService: UserSettingsWebService,
    private readonly configService: ConfigService,
    private readonly toastService: ToastService,
    private readonly globalService: GlobalService
  ) {

    // using userSettingsService.events observable don't works when we land in the home page first
    this.userSettingsService.events
      .subscribe(_ => {
        if (!this.sub) {
          this.setInitialConfiguration();
          this.configServiceSubscription();
          this.globalService.startListening();
        }
      });
  }

  reset() {
    this.configService.init(this.getDefaultConfig());
  }

  private setInitialConfiguration() {
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
        this.toastService.show('UI configuration saved.', 'success');
      });
  }

  /**
   * This function returns a default configuration array, which is either the
   * global configuration or the default configuration for a vanilla builder.
   * @returns The `getDefaultConfig()` function is returning an array that is a
   * concatenation of two arrays: `GLOBAL_CONFIG` and
   * `VANILLA_BUILDER_DEFAULT_CONFIG`. If `GLOBAL_CONFIG` is undefined or null, it
   * will only return `VANILLA_BUILDER_DEFAULT_CONFIG`.
   *
   * `GLOBAL_CONFIG` is usually defined when the make-static schematic is executed.
   */
  getDefaultConfig() {
    return GLOBAL_CONFIG || [...VANILLA_BUILDER_DEFAULT_CONFIG];
  }

}
