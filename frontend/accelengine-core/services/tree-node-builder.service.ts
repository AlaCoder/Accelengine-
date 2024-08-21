import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class TreeNodeBuilderService<T> {

  constructor() {
  }

  toTreeNode(node: T): TreeNode {
    let treeNode: TreeNode = {
      data: node,
      label: node["name"],
      key: node["code"],
      children: node["children"].length > 0 ? [] : null // Set to null if no children (file)
    };
  
    if (node["children"].length > 0) {
      treeNode.expandedIcon = "pi pi-folder-open";
      treeNode.collapsedIcon = "pi pi-folder";
    } else {
      treeNode.icon = "pi pi-file";
    }
  
    this.buildTreeNodeRecursive(treeNode, node);
    return treeNode;
  }
  
  buildTreeNodeRecursive(treeNode: TreeNode, parent: T): void {
    let children: T[] = parent["children"];
    if (children.length != 0) {
      children.forEach((child) => {
        let treeNodeRef: TreeNode = this.toTreeNode(child);
        treeNode.children.push(this.toTreeNode(child));
        this.buildTreeNodeRecursive(treeNodeRef, child);
      });
    }
  }

  expandAll(trees: TreeNode[]): void {
    trees.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll(trees: TreeNode[]): void {
    trees.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  expandRecursive(node: TreeNode, isExpand: boolean): void {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  expandOne(trees: TreeNode[], data: T): void {
    trees.forEach((node) => {
      this.changeOneExpandedRecursive(node, data["id"], true);
    });
  }

  collapseOne(trees: TreeNode[], data: T): void {
    trees.forEach((node) => {
      this.changeOneExpandedRecursive(node, data["id"], false);
    });
  }

  changeOneExpandedRecursive(treeNode: TreeNode, id: number, isExpanded: boolean): void {
    let idData: number = treeNode.data["id"];
    if (idData) {
      if (id === idData) {
        treeNode.expanded = isExpanded;
      } else {
        treeNode.children.forEach((child) => {
          this.changeOneExpandedRecursive(child, id, isExpanded);
        });
      }
    }
  }

  setPartialSelected(trees: TreeNode[], listNodes: number[], partialSelected: boolean): void {
    trees.forEach((node) => {
      this.changePartialSelectedRecursive(node, listNodes, partialSelected);
    });
  }

  changePartialSelectedRecursive(treeNode: TreeNode, listNodes: number[], partialSelected: boolean): void {
    let idData: number = treeNode.data["id"];
    if (idData) {
      if (listNodes.includes(idData)) {
        treeNode.partialSelected = partialSelected;
        listNodes = listNodes.filter((id: number) => id !== idData);
      } else {
        treeNode.children.forEach((child) => {
          this.changePartialSelectedRecursive(child, listNodes, partialSelected);
        });
      }
    }
  }

  getListTreeNodeById(trees: TreeNode[], listNodes: number[]): TreeNode[] {
    let res: TreeNode[] = [];
    trees.forEach((node) => {
      this.getTreeNodeRecursiveById(node, listNodes, res);
    });
    return res;
  }

  getTreeNodeRecursiveById(treeNode: TreeNode, listNodes: number[], res: TreeNode[]): void {
    let idData: number = treeNode.data["id"];
    if (idData) {
      if (listNodes.includes(idData)) {
        res.push(treeNode);
        treeNode.children.forEach((child) => {
          this.getTreeNodeRecursive(child, res);
        });
        listNodes = listNodes.filter((id: number) => id !== idData);
      } else {
        treeNode.children.forEach((child) => {
          this.getTreeNodeRecursiveById(child, listNodes, res);
        });
      }
    }
  }

  getTreeNodeRecursive(treeNode: TreeNode, res: TreeNode[]): void {
    res.push(treeNode);
    treeNode.children.forEach((child) => {
      this.getTreeNodeRecursive(child, res);
    });
  }

  getNodesFromTree(trees: TreeNode[], result: any[] = []): void {
    if (trees) {
      trees.forEach((treeNode: TreeNode) => {
        result.push(treeNode.data);
        this.getNodesFromTree(treeNode.children, result);
      });
    }
  }
}
