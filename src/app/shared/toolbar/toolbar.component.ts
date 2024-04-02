import { Component, OnInit, Input } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { MenuController } from '@ionic/angular';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() showBackButton: boolean = false;
  @Input() title!: string;
  searchTerm: string = '';

  isLoggedIn = false;
  showSearchBar = false;

  constructor(
    private auth: Auth,
    private menuCtrl: MenuController,
    public router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  // Method to toggle the search bar
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
  }

  openMainMenu() {
    this.menuCtrl.enable(true, 'mainMenu');
    this.menuCtrl.open('mainMenu');
  }

  // Side menu
  openUserMenu() {
    this.menuCtrl.enable(true, 'userMenu');
    this.menuCtrl.open('userMenu');
  }

  // Login
  goToLogin() {
    this.router.navigate(['/auth']);
  }

  // On search
  onSearch(term: string) {
    if (term) {
      this.router.navigate(['/search-results'], {
        queryParams: { query: term },
      });
      this.showSearchBar = false;
    }
  }
}
