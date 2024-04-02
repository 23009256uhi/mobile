import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { PostItemComponent } from './post-item/post-item.component';
import { ThumbsComponent } from './thumbs/thumbs.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ToolbarComponent,
    UserMenuComponent,
    PostItemComponent,
    ThumbsComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [
    ToolbarComponent,
    UserMenuComponent,
    PostItemComponent,
    ThumbsComponent,
  ],
})
export class SharedModule {}
