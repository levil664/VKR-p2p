export interface ItemResponseUserDto {
  data: UserDto;
  status: number;
  message?: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: 'ROLE_STUDENT' | 'ROLE_TEACHER' | 'ROLE_ADMIN';
  firstName: string;
  lastName: string;
  middleName: string;
  university: string;
  faculty: string;
  course: number;
}
