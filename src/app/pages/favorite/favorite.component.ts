import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-favorite',
  imports: [NgClass],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  private fetchRecipes(): void {
    this.recipeService.getFavoriteRecipes().subscribe((recipes) => {
      this.favoriteRecipes = recipes;
    });
  }

  toggleFavorite(recipe: Recipe): void {
    this.recipeService.toggleFavorite(recipe).subscribe(() => {
      this.fetchRecipes();
    });
  }

  viewRecipe(id: string) {
    this.router.navigate(['/detail', id]);
  }
}
