import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.page.html',
  styleUrls: ['./create-chat.page.scss'],
})
export class CreateChatPage implements OnInit {
  chatRoomName: string = '';

  constructor(private firestore: Firestore, private navCtrl: NavController) {}

  ngOnInit() {}

  async createChatRoom() {
    if (this.chatRoomName.trim() === '') {
      console.log('Please enter a chat room name');
      return;
    }

    try {
      const chatRoomRef = collection(this.firestore, 'chatRooms');
      await addDoc(chatRoomRef, {
        name: this.chatRoomName,
        createdAt: new Date(),
      });

      // Navigate back or to the newly created chat room page
      this.navCtrl.navigateBack('/');
      console.log('Chat room created successfully');
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  }
}
