import { Component, OnInit, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  increment,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-thumbs',
  templateUrl: './thumbs.component.html',
  styleUrls: ['./thumbs.component.scss'],
})
export class ThumbsComponent implements OnInit {
  @Input() post: any;
  @Input() postId!: string;

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit() {}

  // Check if the user liked a post
  hasLiked(post: any): boolean {
    return (
      Array.isArray(post.likesId) &&
      post.likesId.includes(this.auth.currentUser?.uid)
    );
  }

  // Check if the user diliked a post
  hasDisliked(post: any): boolean {
    return (
      Array.isArray(post.dislikesId) &&
      post.dislikesId.includes(this.auth.currentUser?.uid)
    );
  }

  // Like & dislikes toggle
  async toggleLikesDislikes(postId: string, type: 'likes' | 'dislikes') {
    const user = this.auth.currentUser;
    if (!user) return;

    const postRef = doc(this.firestore, `/posts/${postId}`);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likesId = postData['likesId'] || [];
      const dislikesId = postData['dislikesId'] || [];

      const isLike = type === 'likes';
      const currentArray = isLike ? likesId : dislikesId;
      const oppositeArray = isLike ? dislikesId : likesId;

      const currentIndex = currentArray.indexOf(user.uid);
      const oppositeIndex = oppositeArray.indexOf(user.uid);

      // Toggle logic
      if (currentIndex === -1) {
        currentArray.push(user.uid);
      } else {
        currentArray.splice(currentIndex, 1);
      }

      // Remove user id from opposite array
      if (oppositeIndex !== -1) {
        oppositeArray.splice(oppositeIndex, 1);
      }

      // Update Firestore
      await updateDoc(postRef, {
        [`${type}Id`]: currentArray,
        [`${type === 'likes' ? 'dislikesId' : 'likesId'}`]: oppositeArray,
        [`${type}`]: increment(currentIndex === -1 ? 1 : -1),
        [`${type === 'likes' ? 'dislikes' : 'likes'}`]: increment(
          oppositeIndex !== -1 ? -1 : 0
        ),
      });
    }
  }
}
