import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoginMode = true;

  username: string = '';
  email: string = '';
  password: string = '';

  constructor(public navCntrl: NavController, private auth: Auth) {}

  ngOnInit() {}

  async signup() {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      // Update the user's profile with the username
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: this.username,
        });
      }

      this.navCntrl.navigateForward('/home');

      return userCredential;
    } catch (error) {
      console.error('Sign up error', error);
      return null;
    }
  }

  async login() {
    try {
      const user = await await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      this.navCntrl.navigateForward('/home');
    } catch (error) {
      console.error('Login error', error);
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
