import { Component } from '@angular/core';
import { Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { MenuController } from '@ionic/angular';
import { DepartmentPage } from './department/department.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showDepartments: boolean = false;
  showChats: boolean = false;
  chatRooms$!: Observable<any[]>;
  isLoggedIn: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });

    // Fetch chat rooms
    const chatsRef = collection(this.firestore, `chatRooms`);
    this.chatRooms$ = collectionData(chatsRef, { idField: 'id' });
  }

  async logOut() {
    try {
      await signOut(this.auth);
      this.isLoggedIn = false;
      await this.menuController.close();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  openDepartment(departmentName: string) {
    this.router.navigate(['/department', departmentName]);
  }

  openChatRoom(chatRoomId: string) {
    this.router.navigate(['/chat', chatRoomId]);
  }

  toggleDepartments() {
    this.showDepartments = !this.showDepartments;
  }

  toggleChats() {
    this.showChats = !this.showChats;
  }

  openCreateChat() {
    if (this.isLoggedIn) {
      this.router.navigate([`/create-chat`]);
    } else {
      this.router.navigate([`/auth`]);
    }
  }
}
