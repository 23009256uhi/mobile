import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  searchQuery!: string;
  searchResults$!: Observable<any[]>;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'];
      this.performSearch();
    });
  }

  performSearch() {
    if (this.searchQuery) {
      const postsRef = collection(this.firestore, 'posts');
      const searchQuery = query(
        postsRef,
        where('title', '==', this.searchQuery)
      );
      this.searchResults$ = collectionData(searchQuery);
      console.log(this.searchResults$);
    }
  }
}
