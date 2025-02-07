import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})

export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${recipe.id}`, recipe).pipe(
      catchError((error) => {
        console.error('Update recipe failed', error);
        return throwError(() => new Error(error));
      })
    );
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleFavorite(recipe: Recipe): Observable<Recipe> {
    const updatedRecipe = { ...recipe, favorite: !recipe.favorite };
    return this.updateRecipe(updatedRecipe);
  }

  getFavoriteRecipes(): Observable<Recipe[]> {
    return this.getRecipes().pipe(
      map((recipes) => recipes.filter((recipe) => recipe.favorite))
    );
  }
}
