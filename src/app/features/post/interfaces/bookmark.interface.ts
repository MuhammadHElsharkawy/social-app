export interface IToggleBookmarkPostRES {
  success: boolean;
  message: string;
  data: IToggleBookmarkData;
}

interface IToggleBookmarkData {
  bookmarked: boolean;
  bookmarksCount: number;
}
