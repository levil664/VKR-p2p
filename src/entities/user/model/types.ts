import { UserRole } from './enums';

export interface ItemResponseUserDto {
  data: UserDto;
  status: number;
  message?: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  middleName: string;
  university: string;
  isMentor: boolean;
  faculty: string;
  course: number;
}

export interface UpdateProfileRequest {
  description: string;
}

export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isMentor: boolean;
  description: string;
}

export interface ItemResponseUserProfileDto {
  data: UserProfileDto;
  status: number;
  message?: string;
}
