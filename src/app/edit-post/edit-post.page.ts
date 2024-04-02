import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  postId!: string;
  title: string = '';
  content: string = '';
  forum: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    const postRef = doc(this.firestore, `/posts/${this.postId}`);

    docData(postRef).subscribe((post) => {
      if (post) {
        this.title = post['title'];
        this.content = post['content'];
        this.forum = post['forum'];
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async submitChanges() {
    const postRef = doc(this.firestore, `/posts/${this.postId}`);

    if (!this.title || !this.forum || !this.content) {
      return;
    } else {
      try {
        await updateDoc(postRef, {
          title: this.title,
          content: this.content,
          forum: this.forum,
        });

        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error editing post', error);
      }
    }
  }
}
