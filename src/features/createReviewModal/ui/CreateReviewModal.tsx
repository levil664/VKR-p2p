import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetAdvertQuery } from '../../../entities/advert/api/advertApi';
import { useCreateReviewMutation } from '../../../entities/review/api/reviewApi';
import { useAppSelector } from '../../../app/api';

interface CreateReviewModalProps {
  open: boolean;
  advertId: string | null;
  onClose: () => void;
}

const mentorFields = [
  { name: 'comprehensibility', label: 'Понятность объяснения' },
  { name: 'involvedness', label: 'Вовлеченность в процесс' },
  { name: 'compliance', label: 'Соблюдение договоренностей' },
  { name: 'usefulness', label: 'Польза от встречи' },
];

const studentFields = [
  { name: 'preparedness', label: 'Подготовленность к встрече' },
  { name: 'activity', label: 'Активность в процессе' },
  { name: 'politeness', label: 'Вежливость и стиль общения' },
  { name: 'proactivity', label: 'Готовность к самостоятельной работе' },
];

const whatHelpedOptions = [
  { value: 'EXAMPLES', label: 'Примеры' },
  { value: 'STEP_BY_STEP_EXPLANATION', label: 'Пошаговое объяснение' },
  { value: 'ANALOGIES', label: 'Сравнения' },
  { value: 'VISUAL_SCHEMES', label: 'Визуальные схемы' },
];

const whatCanBeImprovedOptions = [
  { value: 'EXPLANATION_SPEED', label: 'Темп объяснения' },
  { value: 'MORE_EXAMPLES', label: 'Больше примеров' },
  { value: 'CLEAR_EXPLANATIONS', label: 'Четкость объяснений' },
  { value: 'NOTHING', label: 'Ничего' },
];

const whatPleasedOptions = [
  { value: 'QUICK_INVOLVEMENT', label: 'Быстро включился в работу' },
  { value: 'CLEAR_QUESTIONS', label: 'Чётко сформулировал вопрос' },
  { value: 'UNDERSTOOD_EXPLANATION', label: 'Хорошо понял объяснение' },
  { value: 'FOCUSED_ON_RESULT', label: 'Был нацелен на результат' },
];

const whatWasHardOptions = [
  { value: 'UNCLEAR_PROBLEM', label: 'Не знал, в чём проблема' },
  { value: 'NOT_INTERESTED', label: 'Не проявлял интереса' },
  { value: 'NOT_INVOLVED', label: 'Не включался в процесс' },
  { value: 'BROKE_AGREEMENTS', label: 'Нарушал договоренности' },
];

export const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  open,
  advertId,
  onClose,
}) => {
  const currentUserId = useAppSelector(state => state.user.id);
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      text: '',
      ratings: {},
      checkboxes: [],
      wouldInteractAgain: '',
    },
  });

  const { data: advertData, isLoading: isAdvertLoading } = useGetAdvertQuery(advertId!, {
    skip: !advertId,
  });

  const advert = advertData?.data;

  const isMentor = advert?.mentor?.id === currentUserId;
  const isStudent = advert?.student?.id === currentUserId;

  const reviewType = isMentor ? 'STUDENT' : 'MENTOR';

  const handleFormSubmit = async data => {
    if (!advertId) return;

    const payload: any = {
      text: data.text,
      content: {},
    };

    if (reviewType === 'MENTOR') {
      payload.content = {
        comprehensibility: data.ratings.comprehensibility,
        involvedness: data.ratings.involvedness,
        compliance: data.ratings.compliance,
        usefulness: data.ratings.usefulness,
        whatHelped: data.checkboxes.filter(c => whatHelpedOptions.find(o => o.value === c)),
        whatCanBeImproved: data.checkboxes.filter(c =>
          whatCanBeImprovedOptions.find(o => o.value === c)
        ),
        wouldAskAgain: data.wouldInteractAgain === 'yes',
      };
    } else {
      payload.content = {
        preparedness: data.ratings.preparedness,
        activity: data.ratings.activity,
        politeness: data.ratings.politeness,
        proactivity: data.ratings.proactivity,
        whatDidYouLike: data.checkboxes.filter(c => whatPleasedOptions.find(o => o.value === c)),
        difficulties: data.checkboxes.filter(c => whatWasHardOptions.find(o => o.value === c)),
        wouldHelpAgain: data.wouldInteractAgain === 'yes',
      };
    }

    try {
      await createReview({ advertId, body: payload }).unwrap();
      toast.success('Отзыв успешно отправлен!');
      reset();
      onClose();
    } catch (err) {
      toast.error('Не удалось отправить отзыв. Попробуйте ещё раз.');
    }
  };

  const selectedRatings = watch('ratings') || {};

  const fields = reviewType === 'MENTOR' ? mentorFields : studentFields;
  const checkboxes =
    reviewType === 'MENTOR'
      ? [...whatHelpedOptions, ...whatCanBeImprovedOptions]
      : [...whatPleasedOptions, ...whatWasHardOptions];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxWidth: '90%',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',

          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#c4c4c4',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a0a0a0',
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Оставьте отзыв
        </Typography>

        {isAdvertLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          advert && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Вы оставляете отзыв по теме: <strong>«{advert.title}»</strong>.
              </Typography>
            </Box>
          )
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2}>
            {fields.map(field => (
              <Box key={field.name}>
                <Typography variant="body2">{field.label}</Typography>
                <Controller
                  name={`ratings.${field.name}`}
                  control={control}
                  defaultValue={0}
                  render={({ field: { onChange, value } }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <motion.div key={index} whileTap={{ scale: 0.85 }}>
                          <IconButton
                            onClick={() => onChange(index + 1)}
                            size="small"
                            sx={{
                              p: 0.5,
                              '&:hover svg': { color: 'gold' },
                            }}
                          >
                            <FaStar
                              color={index < value ? 'gold' : 'lightgray'}
                              size={24}
                              style={{ transition: 'color 0.2s' }}
                            />
                          </IconButton>
                        </motion.div>
                      ))}
                    </Box>
                  )}
                />
              </Box>
            ))}

            {reviewType === 'MENTOR' ? (
              <>
                <FormLabel>Что особенно помогло:</FormLabel>
                <Grid container spacing={1}>
                  {whatHelpedOptions.map(option => (
                    <Grid item xs={6} sm={6} md={6} key={option.value}>
                      <Controller
                        name="checkboxes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value?.includes(option.value) || false}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  if (checked) {
                                    onChange([...value, option.value]);
                                  } else {
                                    onChange(value.filter(val => val !== option.value));
                                  }
                                }}
                              />
                            }
                            label={option.label}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>

                <FormLabel sx={{ mt: 2 }}>Что можно улучшить:</FormLabel>
                <Grid container spacing={1}>
                  {whatCanBeImprovedOptions.map(option => (
                    <Grid item xs={6} sm={6} md={6} key={option.value}>
                      <Controller
                        name="checkboxes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value?.includes(option.value) || false}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  if (checked) {
                                    onChange([...value, option.value]);
                                  } else {
                                    onChange(value.filter(val => val !== option.value));
                                  }
                                }}
                              />
                            }
                            label={option.label}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <FormLabel>Что особенно порадовало:</FormLabel>
                <Grid container spacing={1}>
                  {whatPleasedOptions.map(option => (
                    <Grid item xs={6} sm={6} md={6} key={option.value}>
                      <Controller
                        name="checkboxes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value?.includes(option.value) || false}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  if (checked) {
                                    onChange([...value, option.value]);
                                  } else {
                                    onChange(value.filter(val => val !== option.value));
                                  }
                                }}
                              />
                            }
                            label={option.label}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>

                <FormLabel sx={{ mt: 2 }}>Какие были трудности:</FormLabel>
                <Grid container spacing={1}>
                  {whatWasHardOptions.map(option => (
                    <Grid item xs={6} sm={6} md={6} key={option.value}>
                      <Controller
                        name="checkboxes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={value?.includes(option.value) || false}
                                onChange={e => {
                                  const checked = e.target.checked;
                                  if (checked) {
                                    onChange([...value, option.value]);
                                  } else {
                                    onChange(value.filter(val => val !== option.value));
                                  }
                                }}
                              />
                            }
                            label={option.label}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Комментарий"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  placeholder="Что понравилось? Что можно улучшить?"
                />
              )}
            />

            <FormControl>
              <FormLabel sx={{ mb: 1 }}>
                {reviewType === 'MENTOR'
                  ? 'Хотели бы обратиться к наставнику снова?'
                  : 'Хотели бы помочь студенту снова?'}
              </FormLabel>
              <Controller
                name="wouldInteractAgain"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="yes" control={<Radio />} label="Да" />
                    <FormControlLabel value="no" control={<Radio />} label="Нет" />
                    <FormControlLabel value="not_sure" control={<Radio />} label="Не уверен" />
                  </RadioGroup>
                )}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={onClose} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                {isLoading ? 'Отправка...' : 'Отправить отзыв'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
