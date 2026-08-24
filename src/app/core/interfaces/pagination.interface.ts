export interface IPagination {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  total: number;
  nextPage?: number;
  prevPage?: number;
}
