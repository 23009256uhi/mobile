import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  author: string = '';
  title: string = '';
  content: string = '';
  forum: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/home']);
  }

  async submitPost() {
    const user = this.auth.currentUser;

    if (!user || !user.displayName) {
      console.error('User must be logged in to post.');
      return;
    }

    this.author = user.displayName;

    if (!this.author || !this.title || !this.content || !this.forum) {
      return;
    } else {
      try {
        await addDoc(collection(this.firestore, 'posts'), {
          author: this.author,
          forum: this.forum,
          title: this.title,
          content: this.content,
          timestamp: new Date(),
          userId: user.uid,
        });

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        console.error('Error submitting post', error);
      }
    }
  }
}
