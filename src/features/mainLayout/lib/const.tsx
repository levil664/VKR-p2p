import { FaClipboardList, FaUser } from 'react-icons/fa';

export const drawerWidth = 180;

export const menuItems = [
  {
    icon: <FaClipboardList />,
    text: 'Заявки',
    link: '/advert',
  },
  {
    icon: <FaUser />,
    text: 'Мои заявки',
    link: '/my-adverts',
  },
];
