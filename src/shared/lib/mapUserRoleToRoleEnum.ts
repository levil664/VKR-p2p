import { RoleEnum, UserRole } from '../../entities/user/model/enums';

export const mapRoleEnumToUserRole = (role: RoleEnum | UserRole): UserRole => {
  switch (role) {
    case RoleEnum.STUDENT:
      return UserRole.STUDENT;
    case RoleEnum.MENTOR:
      return UserRole.MENTOR;
    case RoleEnum.TEACHER:
      return UserRole.TEACHER;
    default:
      return role;
  }
};
