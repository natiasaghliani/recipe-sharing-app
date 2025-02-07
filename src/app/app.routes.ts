import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent() {
      return import('./pages/home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'detail/:id',
    loadComponent() {
      return import('./pages/detail/detail.component').then(
        (m) => m.DetailComponent
      );
    },
  },
  {
    path: 'add-recipe',
    loadComponent() {
      return import('./pages/add-recipe/add-recipe.component').then(
        (m) => m.AddRecipeComponent
      );
    },
  },
  {
    path: 'edit-recipe/:id',
    loadComponent() {
      return import('./pages/add-recipe/add-recipe.component').then(
        (m) => m.AddRecipeComponent
      );
    },
  },
  {
    path: 'favorite',
    loadComponent() {
      return import('./pages/favorite/favorite.component').then(
        (m) => m.FavoriteComponent
      );
    },
  },
  {
    path: '**',
    loadComponent() {
      return import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      );
    },
  },
];
