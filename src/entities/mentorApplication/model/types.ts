import { UserPublicDto } from '../../advert/model';
import { UserProfileDto } from '../../user/model';

export interface MentorApplyRequest {
  description: string;
}

export interface MentorApplicationDto {
  id: string;
  student: UserPublicDto;
  description: string;
  state: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdOn: string;
  updateOn: string;
}

export interface ItemResponseMentorApplicationDto {
  data: MentorApplicationDto;
  status: number;
  message?: string;
}

export interface ListResponseMentorApplicationDto {
  data: MentorApplicationDto[];
  status: number;
  message?: string;
}

export interface ListResponseUserProfileDto {
  data: UserProfileDto[];
  status: number;
  message: string;
}
