import {
  FaClipboardList,
  FaComments,
  FaInfoCircle,
  FaRegFileAlt,
  FaReply,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
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
    link: '/my-advert',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
  {
    icon: <FaReply style={{ fontSize: '20px' }} />,
    text: 'Мои отклики',
    link: '/my-response',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
  {
    icon: <FaUsers style={{ fontSize: '20px' }} />,
    text: 'Групповые занятия',
    link: '/group-meeting',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
  {
    icon: <FaComments style={{ fontSize: '20px' }} />,
    text: 'Чаты',
    link: '/chat',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
  {
    icon: <FaUsers style={{ fontSize: '20px' }} />,
    text: 'Наставники',
    link: '/mentor',
    allowedRoles: [RoleEnum.TEACHER],
  },
  {
    icon: <FaInfoCircle style={{ fontSize: '20px' }} />,
    text: 'Полезная информация',
    link: '/information',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
  {
    icon: <FaRegFileAlt style={{ fontSize: '20px' }} />,
    text: 'Правила использования',
    link: '/rules',
    allowedRoles: [RoleEnum.STUDENT, RoleEnum.MENTOR],
  },
];
