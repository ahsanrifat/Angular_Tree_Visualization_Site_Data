import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/topology', pathMatch: 'full' },
  // {
  //   path: 'recipes', component: RecipesComponent, children: [
  //     { path: '', component: RecipeStartComponent, resolve: [RecipeResolverService] },
  //     { path: 'new', component: RecipeEditComponent },
  //     { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
  //     { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] },
  //   ]
  // },
  // { path: 'shopping-list', component: ShoppingListComponent },
  // { path: 'auth', component: AuthComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
