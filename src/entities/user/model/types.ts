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
  faculty: string;
  course: number;
}
