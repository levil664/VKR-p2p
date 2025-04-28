export enum AdvertStatusEnum {
  ACTIVE = 'Активный',
  COMPLETED = 'Выполнено',
  CANCELLED = 'Отменено',
}

export const AdvertStatus = {
  ACTIVE: { label: 'Активный', color: 'green' },
  COMPLETED: { label: 'Выполнено', color: 'blue' },
  CANCELLED: { label: 'Отменено', color: 'red' },
};
