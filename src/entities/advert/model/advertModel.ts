export interface CreateAdvertRequest {
  title: string;
  description: string;
  subjectId: string;
  topicIds: string[];
  type: 'STUDENT' | 'MENTOR';
}

export interface UpdateAdvertRequest {
  title?: string;
  description?: string;
  subjectId?: string;
  topicIds?: string[];
}

export interface ItemResponseAdvertDto {
  data: AdvertDto;
  status: number;
  message?: string;
}

export interface AdvertDto {
  id: string;
  mentor?: UserPublicDto;
  student?: UserPublicDto;
  title: string;
  description: string;
  subjectId: string;
  topicIds: string[];
  status: 'ACTIVE' | 'IN_PROGRESS' | 'FINISHED' | 'DELETED';
  type: 'STUDENT' | 'MENTOR';
  createdOn: string;
  updatedOn: string;
}

export interface PageResponseAdvertDto {
  data: PageAdvertDto;
  status: number;
  message?: string;
}

export interface PageAdvertDto {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: AdvertDto[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  offset: number;
  sort: SortObject;
}

export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface ListResponseAdvertDto {
  data: AdvertDto[];
  status: number;
  message?: string;
}

export interface UserPublicDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}
