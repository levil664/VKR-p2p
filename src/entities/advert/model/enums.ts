export enum AdvertStatusEnum {
  ACTIVE = 'Активный',
  IN_PROGRESS = 'В процессе',
  COMPLETED = 'Выполнено',
  CANCELLED = 'Отменено',
  DELETED = 'Удалено',
}

export const AdvertStatus = {
  ACTIVE: { label: AdvertStatusEnum.ACTIVE, color: 'green' },
  IN_PROGRESS: { label: AdvertStatusEnum.IN_PROGRESS, color: 'orange' },
  COMPLETED: { label: AdvertStatusEnum.COMPLETED, color: 'blue' },
  CANCELLED: { label: AdvertStatusEnum.CANCELLED, color: 'red' },
  DELETED: { label: AdvertStatusEnum.DELETED, color: 'gray' },
};
