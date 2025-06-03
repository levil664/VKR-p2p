import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import {
  MentorReviewContent,
  ReviewDto,
  StudentReviewContent,
} from '../../../entities/review/model';

interface ReviewCardProps {
  review: ReviewDto;
}

const ratingLabels = {
  comprehensibility: 'Понятность объяснения',
  involvedness: 'Вовлеченность',
  compliance: 'Соблюдение договоренностей',
  usefulness: 'Польза от встречи',
  preparedness: 'Подготовленность',
  activity: 'Активность',
  politeness: 'Вежливость',
  proactivity: 'Самостоятельность',
};

const renderStars = (value: number) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {Array.from({ length: 5 }).map((_, index) => (
      <FaStar key={index} color={index < Math.round(value) ? 'gold' : '#ccc'} size={18} />
    ))}
  </Box>
);

const enumLabelMap = {
  EXAMPLES: 'Примеры',
  STEP_BY_STEP_EXPLANATION: 'Пошаговое объяснение',
  ANALOGIES: 'Сравнения',
  VISUAL_SCHEMES: 'Визуальные схемы',
  EXPLANATION_SPEED: 'Темп объяснения',
  MORE_EXAMPLES: 'Больше примеров',
  CLEAR_EXPLANATIONS: 'Четкость объяснений',
  NOTHING: 'Ничего',
  QUICK_INVOLVEMENT: 'Быстро включился в работу',
  CLEAR_QUESTIONS: 'Чётко сформулировал вопрос',
  UNDERSTOOD_EXPLANATION: 'Хорошо понял объяснение',
  FOCUSED_ON_RESULT: 'Был нацелен на результат',
  UNCLEAR_PROBLEM: 'Не знал, в чём проблема',
  NOT_INTERESTED: 'Не проявлял интереса',
  NOT_INVOLVED: 'Не включался в процесс',
  BROKE_AGREEMENTS: 'Нарушал договоренности',
};

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const isMentorReview = review.type === 'MENTOR';
  const content = review.content as MentorReviewContent | StudentReviewContent;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        {review.reviewer.lastName} {review.reviewer.firstName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {new Date(review.createdOn).toLocaleDateString()}
      </Typography>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {/* рейтинги */}
      </Stack>

      {review.text && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {review.text}
        </Typography>
      )}

      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
        {isMentorReview &&
          (content as MentorReviewContent).whatHelped?.map(tag => (
            <Chip
              key={tag}
              label={`Помогло: ${enumLabelMap[tag] || tag}`}
              color="info"
              size="small"
            />
          ))}
        {isMentorReview &&
          (content as MentorReviewContent).whatCanBeImproved?.map(tag => (
            <Chip
              key={tag}
              label={`Улучшить: ${enumLabelMap[tag] || tag}`}
              size="small"
              color="warning"
            />
          ))}
        {!isMentorReview &&
          (content as StudentReviewContent).whatDidYouLike?.map(tag => (
            <Chip
              key={tag}
              label={`Порадовало: ${enumLabelMap[tag] || tag}`}
              color="info"
              size="small"
            />
          ))}
        {!isMentorReview &&
          (content as StudentReviewContent).difficulties?.map(tag => (
            <Chip
              key={tag}
              label={`Трудности: ${enumLabelMap[tag] || tag}`}
              size="small"
              color="warning"
            />
          ))}
      </Stack>
    </Paper>
  );
};

const RatingRow = ({ label, value }: { label: string; value: number }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="body2">{label}</Typography>
    {renderStars(value)}
  </Box>
);
