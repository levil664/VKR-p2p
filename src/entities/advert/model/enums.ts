export enum AdvertStatusEnum {
  ACTIVE = 'Активная',
  IN_PROGRESS = 'В процессе',
  FINISHED = 'Завершена',
  CANCELLED = 'Отменена',
  DELETED = 'Удалена',
}

export const AdvertStatus = {
  ACTIVE: { label: AdvertStatusEnum.ACTIVE, color: 'green' },
  IN_PROGRESS: { label: AdvertStatusEnum.IN_PROGRESS, color: 'orange' },
  FINISHED: { label: AdvertStatusEnum.FINISHED, color: 'blue' },
  CANCELLED: { label: AdvertStatusEnum.CANCELLED, color: 'red' },
  DELETED: { label: AdvertStatusEnum.DELETED, color: 'gray' },
};
