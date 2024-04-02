import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  increment,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: any;

  constructor(
    private firestore: Firestore,
    private router: Router,
    public auth: Auth
  ) {}

  ngOnInit() {}

  // Open post
  openPost(post: any) {
    this.router.navigate(['/post', post.id]);
  }

  // Edit post
  async editPost(postId: string) {
    this.router.navigate([`/edit-post/${postId}`]);
  }

  // Cancel post
  async cancelPost(postId: string) {
    try {
      const postRef = doc(this.firestore, `/posts/${postId}`);
      await deleteDoc(postRef);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error deleting post', error);
    }
  }
}
