import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoginService } from '@sinequa/core/login';
import { IntlService } from '@sinequa/core/intl';
import { SearchService } from '@sinequa/components/search';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    public searchService: SearchService,
    private titleService: Title,
    private intlService: IntlService
  ) {}

  /**
   * On initialization set the page title
   */
  ngOnInit() {
    this.titleService.setTitle(this.intlService.formatMessage("msg#app.name"));
  }

  /**
   * Manage login and logout
   */
  toggleLogin(){
    if (!!this.loginService.complete) {
      this.loginService.logout();
    }
    else {
      this.loginService.login();
    }
    return false;
  }

  /**
   * Whether the UI is in dark or light mode
   */
  isDark(): boolean {
    return document.body.classList.contains("dark");
  }

  /**
   * Toggle dark mode
   */
  toggleDark() {
    document.body.classList.toggle("dark");
    localStorage.setItem('sinequa-theme', this.isDark()? 'dark' : 'normal');
    return false;
  }
}
