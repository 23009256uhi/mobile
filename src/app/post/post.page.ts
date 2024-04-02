import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  getDoc,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  postId!: string;
  post$!: Observable<any>;
  comments$!: Observable<any[]>;
  title!: string;
  isInputFocused: boolean = false;
  newComment: string = '';
  editingCommentId: string | null = null;
  editedCommentContent: string = '';

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: Auth
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') as string;
    const postRef = doc(this.firestore, `posts/${this.postId}`);
    this.post$ = docData(postRef);

    const commentsRef = collection(
      this.firestore,
      `posts/${this.postId}/comments`
    );
    const sortedCommentsQuery = query(commentsRef, orderBy('timestamp', 'asc'));
    this.comments$ = collectionData(sortedCommentsQuery, { idField: 'id' });

    this.post$.subscribe((post) => {
      this.title = post.forum;
    });
  }

  onFocus() {
    this.isInputFocused = true;
  }

  onBlur() {
    this.isInputFocused = false;
  }

  updateCommentCount(postId: string, incrementBy: number) {
    // Reference to the post
    const postRef = doc(this.firestore, `posts/${this.postId}`);

    // Get the current comment count and increment it
    getDoc(postRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const currentCommentCount = data['commentCount'] || 0;
        updateDoc(postRef, {
          commentCount: currentCommentCount + incrementBy,
        });
      } else {
        console.log('User must be logged in to post comments.');
      }
    });
  }

  // SUBMIT COMMENT
  async submitComment() {
    const user = this.auth.currentUser;

    if (user && this.newComment.trim()) {
      const commentsRef = collection(
        this.firestore,
        `posts/${this.postId}/comments`
      );
      const newCommentRef = await addDoc(commentsRef, {
        content: this.newComment,
        author: user.displayName,
        timestamp: serverTimestamp(),
      });

      this.newComment = '';
      this.updateCommentCount(this.postId, 1);
      this.addCommentNotification(this.postId, newCommentRef.id, user.uid);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  // EDIT COMMENT
  startEditComment(comment: any) {
    this.editingCommentId = comment.id;
    this.editedCommentContent = comment.content;
  }

  async editComment() {
    if (this.editingCommentId) {
      const commentRef = doc(
        this.firestore,
        `posts/${this.postId}/comments/${this.editingCommentId}`
      );

      try {
        await updateDoc(commentRef, {
          content: this.editedCommentContent,
        });
        this.editingCommentId = null;
        this.editedCommentContent = '';
      } catch (error) {
        console.error('Error editing comment', error);
      }
    }
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editedCommentContent = '';
  }

  // DELETE COMMENT
  async deleteComment(commentId: string) {
    const commentRef = doc(
      this.firestore,
      `posts/${this.postId}/comments/${commentId}`
    );
    await deleteDoc(commentRef);
    this.updateCommentCount(this.postId, -1);
  }

  // ADD COMMENT NOTIFICATION
  async addCommentNotification(
    postId: string,
    commentId: string,
    userId: string
  ) {
    const notificationsRef = collection(this.firestore, `notifications`);

    await addDoc(notificationsRef, {
      userId: userId,
      postId: postId,
      commentId: commentId,
      timestamp: new Date(),
      read: false,
    });
  }
}
