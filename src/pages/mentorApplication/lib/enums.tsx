export enum MentorApplicationStatusRusEnum {
  PENDING = 'Ожидает',
  APPROVED = 'Одобрено',
  REJECTED = 'Отклонено',
}

export enum MentorApplicationStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const MentorApplicationStatus = {
  PENDING: { label: 'Ожидает', color: '#f0ad4e' },
  APPROVED: { label: 'Одобрено', color: '#5cb85c' },
  REJECTED: { label: 'Отклонено', color: '#d9534f' },
};
