import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCheckboxModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatSelectModule,
	MatSortModule,
	MatTreeModule,
	MatSnackBarModule,
	MatCardModule
} from '@angular/material';

@NgModule({
	imports: [ CommonModule ],
	declarations: [],
	exports: [
		MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCheckboxModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatSelectModule,
		MatSortModule,
		MatTreeModule,
		MatSnackBarModule,
		MatCardModule
	]
})
export class MaterialModule {}
