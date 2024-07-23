import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { SeriesComponent } from './pages/series/series.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'series',
    component: SeriesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'galeria',
    component: GalleryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [AuthGuard],
  },
];
