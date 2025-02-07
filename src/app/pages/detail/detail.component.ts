import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-detail',
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  recipe: Recipe | null = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRecipe();
  }

  private fetchRecipe(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeById(id).subscribe((data) => {
        this.recipe = data;
    });
    }
  }

  deleteRecipe(): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      if (this.recipe) {
        this.recipeService.deleteRecipe(this.recipe.id).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  editRecipe(): void {
    if (this.recipe) {
      this.router.navigate(['/edit-recipe', this.recipe.id]);
    }
  }
}
