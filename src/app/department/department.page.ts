import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  query,
  where,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-department',
  templateUrl: './department.page.html',
  styleUrls: ['./department.page.scss'],
})
export class DepartmentPage implements OnInit {
  departmentName!: string;
  posts$!: Observable<any[]>;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit() {
    this.departmentName = this.route.snapshot.paramMap.get('name')!;
    const postsRef = collection(this.firestore, 'posts');
    const queryByDepartment = query(
      postsRef,
      where('forum', '==', this.departmentName)
    );
    this.posts$ = collectionData(queryByDepartment, { idField: 'id' });
  }
}
