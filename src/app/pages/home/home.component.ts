import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { NgClass } from '@angular/common';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [FormsModule, NgClass],
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];

  searchQuery: string = '';

  // რადგან პაგინაცია არ არსებობს, ამიტომ ვფილტრავ ლოკალურად
  // სხვა შემთხვევაში, ბექიდან წამოვიღებდი გაფილტრულებს
  get filteredRecipes(): Recipe[] {
    return this.recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
    );
  }

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
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
