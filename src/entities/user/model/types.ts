import { UserRole } from './enums';

export interface MentorStats {
  comprehensibility: number;
  involvedness: number;
  compliance: number;
  usefulness: number;
  wouldAskAgainRate: number;
}

export interface StudentStats {
  preparedness: number;
  activity: number;
  politeness: number;
  proactivity: number;
  wouldHelpAgainRate: number;
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
  description: string;
  mentorStats?: MentorStats;
  studentStats?: StudentStats;
}

export interface ItemResponseUserDto {
  data: UserDto;
  status: number;
  message?: string;
}

export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isMentor: boolean;
  description: string;
  mentorStats?: MentorStats;
  studentStats?: StudentStats;
}

export interface ItemResponseUserProfileDto {
  data: UserProfileDto;
  status: number;
  message?: string;
}

export interface UpdateProfileRequest {
  description: string;
}
