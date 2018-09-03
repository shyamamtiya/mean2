import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { UtilService } from './util.service';
import { HttpModule } from '@angular/http';

@NgModule({
	declarations: [ AppComponent ],
	imports: [
		BrowserModule,
    FormsModule,
    HttpModule,
		ReactiveFormsModule,
		MaterialModule,
		BrowserAnimationsModule,
		AppRoutingModule
	],
	providers: [UtilService],
	bootstrap: [ AppComponent ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
