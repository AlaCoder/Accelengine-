import { Account } from "./account.model";
import { TreeNode } from 'primeng/api';
export class AccountChildrenTreeDTO {
    accountChildren: Account[];
    accountTee?: TreeNode[];
}