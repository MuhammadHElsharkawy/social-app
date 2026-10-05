import { IBaseRES } from '../../../core/interfaces/base-res.interface';
import { IPagination } from '../../../core/interfaces/pagination.interface';
import { IUser } from '../../../core/interfaces/user.interface';

export interface IGetFollowSuggestionsRES extends IBaseRES {
  data: IGetFollowSuggestionsData;
  meta: Meta;
}

interface Meta {
  pagination: IPagination;
}

interface IGetFollowSuggestionsData {
  suggestions: IUser[];
}
