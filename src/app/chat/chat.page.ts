import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  doc,
  docData,
  deleteDoc,
  collectionData,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatRoomId!: string;
  chatName$!: Observable<string>;
  messages$!: Observable<any[]>;
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public auth: Auth
  ) {}

  ngOnInit() {
    this.chatRoomId = this.route.snapshot.paramMap.get('id')!;

    // Fetch chat room details
    const chatRoomRef = doc(this.firestore, `chatRooms/${this.chatRoomId}`);
    this.chatName$ = docData(chatRoomRef).pipe(
      map((chatRoom: any) => (chatRoom ? chatRoom.name : 'Unknown'))
    );

    // Fetch messages
    const messagesRef = collection(
      this.firestore,
      `chatRooms/${this.chatRoomId}/messages`
    );
    this.messages$ = collectionData(messagesRef, { idField: 'id' });
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') return;

    const user = this.auth.currentUser;
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    const messageToSend = {
      user: user.displayName,
      text: this.newMessage,
      timestamp: new Date(),
    };

    const messagesRef = collection(
      this.firestore,
      `/chatRooms/${this.chatRoomId}/messages`
    );
    try {
      await addDoc(messagesRef, messageToSend);
      this.newMessage = '';
    } catch (error) {
      console.error('Error sending message', error);
    }
  }

  async deleteMessage(messageId: string) {
    const messageRef = doc(
      this.firestore,
      `/chatRooms/${this.chatRoomId}/messages/${messageId}`
    );
    await deleteDoc(messageRef);
  }
}
