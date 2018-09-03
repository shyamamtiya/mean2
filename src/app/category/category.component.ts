import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from '../util.service';
import { MatSnackBar } from '@angular/material';

/**
 * Node for to-do item
 */
export class TodoItemNode {
	children: TodoItemNode[];
	item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
	item: string;
	level: number;
	expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
var TREE_DATA = [];

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
	dataChange = new BehaviorSubject<TodoItemNode[]>([]);

	get data(): TodoItemNode[] {
		return this.dataChange.value;
	}

	constructor(public utilService: UtilService, public matSnackBar: MatSnackBar) {
		this.initialize();
	}

	initialize() {
		// Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
		//     file node as children.
		for (var i = 0; i < TREE_DATA.length; i++) {
			const data = this.buildFileTree(TREE_DATA[i], 0);
			console.log('data', data);
			// Notify the change.
			this.dataChange.next(data);
		}
	}

	/**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
	buildFileTree(obj: object, level: number): TodoItemNode[] {
		return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
			const value = obj[key];
			const node = new TodoItemNode();
			node.item = key;

			if (value != null) {
				if (typeof value === 'object') {
					node.children = this.buildFileTree(value, level + 1);
				} else {
					node.item = value;
				}
			}

			return accumulator.concat(node);
		}, []);
	}

	/** Add an item to to-do list */
	insertItem(parent: TodoItemNode, name: string) {
		if (parent) {
			console.log('parent', parent);
			parent.children.push({ item: name } as TodoItemNode);
			this.dataChange.next(this.data);
		}
	}
	removeItem(parent: TodoItemNode, index: number) {
		if (parent.children.length) {
			console.log('before delteion:', index);
			let c = parent.children.splice(0, 1);
			console.log('after delteion:', c);
			let obj = {
				item: parent.item,
				children: parent.children
			};
			console.log('final obj', obj);
			this.utilService
				.removeSubCategory(obj)
				.then((res) => {
					this.matSnackBar.open(res._body, 'Undo', {
						duration: 500
					});
				})
				.catch((err) => {});
		} else {
			let str = { item: parent.item, children: [] };
			let obj = {
				item: parent.item
			};
			this.utilService.removeCategory(obj).then((res) => {
				this.matSnackBar.open(res._body, 'Undo', {
					duration: 500
				});
			});
			this.data.splice(this.data.indexOf(str), 1);
		}
		this.dataChange.next(this.data);
	}
	updateItem(node: TodoItemNode, name: string) {
		node.item = name;
		this.dataChange.next(this.data);
	}
}

/**
 * @title Tree with checkboxes
 */
@Component({
	selector: 'apprcategory',
	templateUrl: 'category.component.html',
	styleUrls: [ 'category.component.scss' ],
	providers: [ ChecklistDatabase ]
})
export class CategoryComponent implements OnInit {
	/** Map from flat node to nested node. This helps us finding the nested node to be modified */
	flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
	parent: string = '';
	/** Map from nested node to flattened node. This helps us to keep the same object for selection */
	nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

	/** A selected parent node to be inserted */
	selectedParent: TodoItemFlatNode | null = null;

	/** The new item's name */
	newItemName = '';

	treeControl: FlatTreeControl<TodoItemFlatNode>;

	treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

	dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

	/** The selection for checklist */
	checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

	constructor(private database: ChecklistDatabase, public utilService: UtilService, public matSnackBar: MatSnackBar) {
		this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
		this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
		this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
	}

	ngOnInit() {
		this.utilService
			.getCategories()
			.then((data) => {
				var x = data.json();
				console.log('data in res', x);
				var newData: TodoItemNode[] = [];
				for (var i = 0; i < x.length; i++) {
					let obj: TodoItemNode = {
						item: x[i]._id,
						children: x[i].children
					};
					newData.push(obj);
				}
				this.dataSource.data = newData;
				console.log('new', newData);
				this.database.dataChange.next(this.dataSource.data);
				this.database.dataChange.subscribe((data) => {
					this.dataSource.data = data;
				});
			})
			.catch((err) => {
				console.log('err', err);
			});
	}

	getLevel = (node: TodoItemFlatNode) => node.level;

	isExpandable = (node: TodoItemFlatNode) => node.expandable;

	getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

	hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

	hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

	/**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
	transformer = (node: TodoItemNode, level: number) => {
		const existingNode = this.nestedNodeMap.get(node);
		const flatNode = existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
		flatNode.item = node.item;
		flatNode.level = level;
		flatNode.expandable = !!node.children;
		this.flatNodeMap.set(flatNode, node);
		this.nestedNodeMap.set(node, flatNode);
		return flatNode;
	};

	/** Select the category so we can insert the new item. */
	addNewItem(node: TodoItemFlatNode, flag) {
		if (flag) {
			const parentNode = this.flatNodeMap.get(node);
			let obj = {
				item: parentNode.item,
				children: parentNode.children
			};
			this.utilService.addNewCategory(obj).then((res) => {
				this.matSnackBar.open(res._body, 'Undo', {
					duration: 500
				});
			});
		} else {
			const parentNode = this.flatNodeMap.get(node);
			console.log('pn', parentNode);
			this.parent = parentNode.item;
			console.log(this.parent);
			this.database.insertItem(parentNode!, '');
			this.treeControl.expand(node);
		}
	}

	/** Save the node to database */
	saveNode(node: TodoItemFlatNode, itemValue: string) {
		console.log('nd', node);
		const nestedNode = this.flatNodeMap.get(node);
		console.log('nstd', nestedNode);
		let obj = {
			parent: this.parent,
			item: itemValue
		};
		//	this.utilService.addSubCategory(obj).then((res) => {
		this.database.updateItem(nestedNode!, itemValue);
		//});
	}

	AddNewNode(value) {
		let obj = {
			item: value,
			children: []
		};
		this.utilService.addNewCategory(obj).then((res) => {
			console.log(this.database.data.push(obj), value);
			this.matSnackBar.open(res._body, 'Undo', {
				duration: 500
			});
			this.database.dataChange.next(this.database.data);
		});
	}
	removeItem(node, index) {
		const parentNode = this.flatNodeMap.get(node);
		console.log(index);
		this.database.removeItem(parentNode!, index);
		this.treeControl.expand(node);
	}
}
