import { FaClipboardList, FaUser } from 'react-icons/fa';

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
];
