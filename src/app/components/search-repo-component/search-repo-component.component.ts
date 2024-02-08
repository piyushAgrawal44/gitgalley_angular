import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchRepoService } from 'src/app/services/fetch-repo.service';
@Component({
  selector: 'app-search-repo-component',
  templateUrl: './search-repo-component.component.html',
  styleUrls: ['./search-repo-component.component.scss']
})
export class SearchRepoComponentComponent {
  private subscription: Subscription | undefined;
  usernameRef: string = 'piyushAgrawal44';
  query: string = '';
  perPage = 10;
  page = 1;
  repos: any = { total_count: 0, items: [] };
  totalPages: number = 0;
  userDetails: any = {};
  selectedModal: any = {};
  public_repo_count: number = 0;
  queryUsername: string = "piyushAgrawal44";
  isRepoLoading: boolean = true;
  isImageLoading: boolean = true;

  constructor(private FetchRepoService: FetchRepoService) {

    const currentUrl = window.location.search;
    const urlParams = new URLSearchParams(currentUrl);
    this.queryUsername = urlParams.get('username') ?? "piyushAgrawal44";
    if (this.queryUsername != null && this.queryUsername != "") {
      this.usernameRef = this.queryUsername.trim();
    }
  }
  isModalOpen: boolean = false;



  ngOnInit(): void {
    this.fetchUserDetails();
  }

  pageChange(val: number = 1): void {
    this.page = val;
    this.isRepoLoading = true;
    this.fetchData();
  }

  perPageChange(val: number = 10): void {
    this.perPage = val;
    this.page = 1;
    this.isRepoLoading = true;
    this.fetchTotalRepo();
    this.fetchData();
  }

  openModal(repo: any) {

    this.isModalOpen = true;
    this.selectedModal = repo;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  fetchUserDetails(): void {
    this.subscription = this.FetchRepoService.fetchUserDetails(this.usernameRef)
      .subscribe(
        async (response) => {

          this.userDetails = response;
          if (!this.query) {
            // query is blank
            this.repos.total_count = this.userDetails.public_repos;
            this.public_repo_count = this.userDetails.public_repos;
            this.totalPages = Math.ceil(this.repos.total_count / this.perPage);
          }
          else {
            this.fetchTotalRepo();
          }
          this.fetchData();
        },
        (error) => {
          console.error(error);
        }
      );
  }

  fetchTotalRepo(): void {
    if (!this.query) {
      this.repos.total_count = this.public_repo_count;
    }
    else {
      this.subscription = this.FetchRepoService.totalRepo(this.usernameRef, this.query)
        .subscribe(
          async (response) => {


            this.repos.total_count = response.total_count;


            
          },
          (error) => {
            console.error(error);
          }
        );
    }
    this.totalPages = Math.ceil(this.repos.total_count / this.perPage);

  }

  fetchData(): void {

    this.subscription = this.FetchRepoService.fetchRepo(this.usernameRef, this.perPage, this.page, this.query)
      .subscribe(
        async (response) => {

          if (!this.query) {
            this.repos.items = response;
          }
          else {
            this.repos.items = response.items;
          }

          this.isRepoLoading = false;
          this.isImageLoading=false;

        },
        (error) => {
          console.error(error);
        }
      );


  }


  searchUser(): void {
    this.isRepoLoading = true;
    this.page = 1;
    this.fetchUserDetails();
    this.fetchData();
    this.fetchTotalRepo();
  }

  searchRepoForQuery(): void {
    this.isRepoLoading = true;
    this.page = 1;
    this.fetchTotalRepo();
    this.fetchData();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}
