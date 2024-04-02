import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs';
import { doc, getDoc, where, query } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  notifications: any[] = [];
  currentUserId: string = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.fetchNotifications();
      }
    });
  }

  fetchNotifications() {
    // Fetch the posts created by the current user
    const postsRef = collection(this.firestore, 'posts');
    const userPostsQuery = query(
      postsRef,
      where('userId', '==', this.currentUserId)
    );

    collectionData(userPostsQuery, { idField: 'id' })
      .pipe(
        switchMap((userPosts: any[]) => {
          const postIds = userPosts.map((post) => post.id);

          // Fetch the notifications for the user's posts
          const notificationsRef = collection(this.firestore, 'notifications');
          const notificationsQuery = query(
            notificationsRef,
            where('postId', 'in', postIds)
          );

          return collectionData(notificationsQuery, { idField: 'id' }).pipe(
            switchMap((notifications: any[]) => {
              const commentPromises = notifications.map((notification) =>
                getDoc(
                  doc(
                    this.firestore,
                    'posts',
                    notification.postId,
                    'comments',
                    notification.commentId
                  )
                ).then((commentDoc) => {
                  const commentData = commentDoc.data();
                  return {
                    ...notification,
                    commentUserName: commentData
                      ? commentData['author'] || 'Unknown User'
                      : 'Unknown User',
                  };
                })
              );
              return Promise.all(commentPromises);
            })
          );
        })
      )
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  openPost(postId: string) {
    this.router.navigate(['/post', postId]);
  }
}
