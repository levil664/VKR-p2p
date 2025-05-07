import { AdvertDto, UserPublicDto } from '../../advert/model';

export interface CreateAdvertResponseRequest {
  description: string;
}

export interface AdvertResponseDto {
  id: string;
  respondent: UserPublicDto;
  description: string;
  createdOn: string;
  chatId: string;
  accepted: boolean;
}

export interface ItemResponseAdvertResponseDto {
  data: AdvertResponseDto;
  status: number;
  message?: string;
}

export interface ListResponseAdvertResponseDto {
  data: AdvertResponseDto[];
  status: number;
  message?: string;
}

export interface AdvertWithResponseDto {
  advert: AdvertDto;
  response: AdvertResponseDto;
}

export interface ListResponseAdvertWithResponseDto {
  data: AdvertWithResponseDto[];
  status: number;
  message?: string;
}
