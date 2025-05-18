import { UserPublicDto } from '../../advert/model';

export interface CreateReviewRequest {
  text: string;
  rating: number;
}

interface AdvertPublicDto {
  id: string;
  creator: UserPublicDto;
  title: string;
  description: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'FINISHED' | 'DELETED';
  type: 'STUDENT' | 'MENTOR';
}

export interface ReviewDto {
  id: string;
  reviewer: UserPublicDto;
  reviewee: UserPublicDto;
  advert: AdvertPublicDto;
  rating: number;
  type: 'MENTOR' | 'STUDENT';
  text: string;
  createdOn: string;
}

export interface ItemResponseReviewDto {
  data: ReviewDto;
  status: number;
  message?: string;
}

export interface ListResponseReviewDto {
  data: ReviewDto[];
  status: number;
  message?: string;
}

export interface ListResponseAdvertsWithoutReviewDto {
  data: AdvertPublicDto[];
  status: number;
  message?: string;
}
