import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

const url = 'http://localhost:3001/category/';
@Injectable({
	providedIn: 'root'
})
export class UtilService {
	constructor(public http: Http) {}
	addNewCategory(category): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.http.post(url + 'category/', JSON.stringify(category), { headers: headers }).subscribe(
				(data) => {
					console.log(data);
					resolve(data);
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);
		});
	}
	addSubCategory(subCategory): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.http.post(url + 'subcategory/', JSON.stringify(subCategory), { headers: headers }).subscribe(
				(data) => {
					console.log(data);
					resolve(data);
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);
		});
	}
	getCategories(): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.http.get(url + 'category/', { headers: headers }).subscribe(
				(data) => {
					let obj = data.json();
					console.log('data', obj);
					resolve(data);
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);
		});
	}
	removeSubCategory(remsubCategory): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.http.post(url + 'removesubcategory/', JSON.stringify(remsubCategory), { headers: headers }).subscribe(
				(data) => {
					console.log(data);
					resolve(data);
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);
		});
	}
	removeCategory(remCategory): Promise<any> {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			headers.append('Content-Type', 'application/json');
			this.http.post(url + 'removecategory/', JSON.stringify(remCategory), { headers: headers }).subscribe(
				(data) => {
					console.log(data);
					resolve(data);
				},
				(error) => {
					console.log(error);
					reject(error);
				}
			);
		});
	}
}
