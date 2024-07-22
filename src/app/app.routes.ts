import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { SeriesComponent } from './pages/series/series.component';
import { GalleryComponent } from './pages/gallery/gallery.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'series',
    component: SeriesComponent
  },
  {
    path: 'galeria',
    component: GalleryComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
];
