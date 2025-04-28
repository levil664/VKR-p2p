import { FaClipboardList, FaUser } from 'react-icons/fa';
import { RoleEnum } from '../../../entities/user/model/enums';

export const drawerWidth = 200;

export const menuItems = [
  {
    icon: <FaClipboardList style={{ fontSize: '20px' }} />,
    text: 'Заявки',
    link: '/advert',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.TEACHER, RoleEnum.MENTOR],
  },
  {
    icon: <FaUser style={{ fontSize: '20px' }} />,
    text: 'Мои заявки',
    link: '/my-adverts',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
];
