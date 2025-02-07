import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-recipe',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  thumbnailPreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  recipeId: string | null = null;

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initRecipeForm();
  }

  ngOnInit(): void {
    this.checkAndSetEditMode();
  }

  private initRecipeForm(): void {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([this.fb.control('', Validators.required)]),
      instructions: ['', Validators.required],
      thumbnail: [null, Validators.required],
      favorite: [false],
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  onThumbnailChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.recipeForm.patchValue({ thumbnail: file });
      this.recipeForm.get('thumbnail')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private checkAndSetEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = String(id);
      this.setEditForm();
    }
  }

  private setEditForm(): void {
    this.recipeService.getRecipeById(this.recipeId!).subscribe((recipe) => {
      this.recipeForm.patchValue({
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        thumbnail: recipe.thumbnail,
        favorite: recipe.favorite,
      });
      this.thumbnailPreview = recipe.thumbnail;
      const ingredientsArray = this.recipeForm.get('ingredients') as FormArray;
      ingredientsArray.clear();
      recipe.ingredients.forEach((ingredient: string) => {
        ingredientsArray.push(this.fb.control(ingredient, Validators.required));
      });

      this.recipeForm.get('thumbnail')?.clearValidators();
      this.recipeForm.get('thumbnail')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      const newRecipe: any = {
        title: formValue.title,
        description: formValue.description,
        ingredients: formValue.ingredients,
        instructions: formValue.instructions,
      };

      const thumbnailControl = this.recipeForm.get('thumbnail');
      const thumbnailValue = thumbnailControl?.value;

      if (thumbnailValue instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          newRecipe.thumbnail = reader.result as string;
          this.saveRecipe(newRecipe);
        };
        reader.readAsDataURL(thumbnailValue);
      } else {
        newRecipe.thumbnail = thumbnailValue;
        this.saveRecipe(newRecipe);
      }
    } else {
      this.recipeForm.markAllAsTouched();
    }
  }

  private saveRecipe(recipe: any): void {
    if (this.isEditMode) {
      recipe.id = this.recipeId;
      this.recipeService.updateRecipe(recipe).subscribe(() => {
        this.router.navigate(['/detail', this.recipeId]);
      });
    } else {
      recipe.id = Date.now().toString();
      this.recipeService.addRecipe(recipe).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
