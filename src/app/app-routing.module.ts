import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'post/:id',
    loadChildren: () =>
      import('./post/post.module').then((m) => m.PostPageModule),
  },
  {
    path: 'chat/:id',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'create-post',
    loadChildren: () =>
      import('./create-post/create-post.module').then(
        (m) => m.CreatePostPageModule
      ),
  },
  {
    path: 'edit-post/:id',
    loadChildren: () =>
      import('./edit-post/edit-post.module').then((m) => m.EditPostPageModule),
  },
  {
    path: 'create-chat',
    loadChildren: () =>
      import('./create-chat/create-chat.module').then(
        (m) => m.CreateChatPageModule
      ),
  },
  {
    path: 'department/:name',
    loadChildren: () =>
      import('./department/department.module').then(
        (m) => m.DepartmentPageModule
      ),
  },
  {
    path: 'search-results',
    loadChildren: () => import('./search-results/search-results.module').then( m => m.SearchResultsPageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./inbox/inbox.module').then( m => m.InboxPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
