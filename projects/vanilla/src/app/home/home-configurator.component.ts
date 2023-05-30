import { Component, inject } from '@angular/core';
import { LoginService } from '@sinequa/core/login';

@Component({
  selector: 'app-home-configurator',
  templateUrl: 'home-configurator.component.html'
})

export class HomeConfiguratorComponent {

  loginService = inject(LoginService);
}