import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { MaterialModule } from './material/material.module';

const routes: Routes = [
	{
		path: '',
		component: CategoryComponent
	},
	{
		path: 'category',
		component: CategoryComponent
	},
	{
		path: '**',
		component: CategoryComponent
	}
];

@NgModule({
	imports: [ CommonModule, MaterialModule, RouterModule.forRoot(routes) ],
	exports: [ RouterModule, CategoryComponent ],
	declarations: [ CategoryComponent ]
})
export class AppRoutingModule {}
