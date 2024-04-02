import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  runTransaction,
  doc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedIn = false;
  showSearchBar = false;
  posts!: Observable<any[]>;
  notifications!: any[];
  currentUserId: string = '';
  unreadNotificationsCount: number = 0;

  constructor(
    public auth: Auth,
    private firestore: Firestore,
    public router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUserId = user.uid;
        this.fetchUnreadNotificationsCount();

        // this.fetchNotifications();
      } else {
        this.isLoggedIn = false;
      }
    });

    const postsRef = collection(this.firestore, 'posts');
    this.posts = collectionData(postsRef, { idField: 'id' });
  }

  // Navigate to Create post
  navigateToCreatePost() {
    if (this.isLoggedIn) {
      this.router.navigate(['/create-post']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  // Navigate to inbox
  navigateToInbox() {
    if (this.isLoggedIn) {
      this.router.navigate(['/inbox']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  // Fetch notifications
  // fetchNotifications() {
  //   const notificationsRef = collection(this.firestore, 'notifications');
  //   collectionData(notificationsRef, { idField: 'id' })
  //     .pipe(
  //       map((notifications: any[]) =>
  //         notifications.filter(
  //           (notification) => notification.userId === this.currentUserId
  //         )
  //       )
  //     )
  //     .subscribe((notifications) => {
  //       this.notifications = notifications;
  //     });
  // }

  // Fetch unread notifications count
  fetchUnreadNotificationsCount() {
    const notificationsRef = collection(this.firestore, 'notifications');
    const unreadNotificationsQuery = query(
      notificationsRef,
      where('userId', '==', this.currentUserId),
      where('read', '==', false)
    );

    collectionData(unreadNotificationsQuery)
      .pipe(map((notifications: any[]) => notifications.length))
      .subscribe((count) => {
        this.unreadNotificationsCount = count;
      });
  }
}
