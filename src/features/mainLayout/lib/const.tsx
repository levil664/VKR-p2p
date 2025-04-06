import { FaClipboardList, FaUser } from 'react-icons/fa';
import { MdGroupAdd } from 'react-icons/md';

export const drawerWidth = 200;

export const menuItems = [
  {
    icon: <FaClipboardList style={{ fontSize: '20px' }} />,
    text: 'Заявки',
    link: '/advert',
  },
  {
    icon: <FaUser style={{ fontSize: '20px' }} />,
    text: 'Мои заявки',
    link: '/my-adverts',
  },
  {
    icon: <MdGroupAdd style={{ fontSize: '24px' }} />,
    text: 'Наставничество',
    link: '/mentoring',
  },
];
