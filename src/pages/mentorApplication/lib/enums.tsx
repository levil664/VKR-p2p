export enum MentorApplicationStatusEnum {
  PENDING = 'Ожидает',
  APPROVED = 'Одобрено',
  REJECTED = 'Отклонено',
}

export const MentorApplicationStatus = {
  PENDING: { label: 'Ожидает', color: '#f0ad4e' },
  APPROVED: { label: 'Одобрено', color: '#5cb85c' },
  REJECTED: { label: 'Отклонено', color: '#d9534f' },
};
