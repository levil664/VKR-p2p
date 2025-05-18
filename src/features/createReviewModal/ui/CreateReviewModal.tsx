import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateReviewMutation } from '../../../entities/review/api/reviewApi';
import { CreateReviewRequest } from '../../../entities/review/model';
import { useGetAdvertQuery } from '../../../entities/advert/api/advertApi';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CreateReviewModalProps {
  open: boolean;
  advertId: string | null;
  onClose: () => void;
}

export const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  open,
  advertId,
  onClose,
}) => {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { control, handleSubmit, reset } = useForm<CreateReviewRequest>({
    defaultValues: {
      text: '',
      rating: 0,
    },
  });

  const { data: advertData, isLoading: isAdvertLoading } = useGetAdvertQuery(advertId!, {
    skip: !advertId,
  });

  const handleFormSubmit = async (data: CreateReviewRequest) => {
    if (!advertId) return;

    try {
      await createReview({ advertId, body: data }).unwrap();
      toast.success('Отзыв успешно отправлен!');
      reset();
      onClose();
    } catch (err) {
      toast.error('Не удалось отправить отзыв. Попробуйте ещё раз.');
    }
  };

  const advert = advertData?.data;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          maxWidth: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
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
                Вы собираетесь оставить отзыв по заявке <strong>«{advert.title}»</strong>.<br />{' '}
                Заявка была создана пользователем:{' '}
                <strong>
                  {advert.creator?.lastName} {advert.creator?.firstName}{' '}
                  {advert.creator?.middleName}
                </strong>
                .<br />
                Описание заявки: «{advert.description}».
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Пожалуйста, расскажите, как проходило взаимодействие, что запомнилось, что можно
                улучшить. Ваш отзыв поможет другим пользователям лучше ориентироваться в сервисе.
              </Typography>
            </Box>
          )
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ваш отзыв"
                fullWidth
                margin="normal"
                multiline
                rows={6}
                required
                placeholder="Что понравилось? Что можно улучшить? Поделитесь своим опытом."
              />
            )}
          />
          <Controller
            name="rating"
            control={control}
            rules={{ required: 'Пожалуйста, выберите рейтинг' }}
            render={({ field: { onChange, value } }) => (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Рейтинг:
                </Typography>
                {Array.from({ length: 5 }, (_, index) => {
                  const starValue = index + 1;
                  return (
                    <motion.div key={index} whileTap={{ scale: 0.85 }}>
                      <IconButton
                        onClick={() => onChange(starValue)}
                        size="small"
                        sx={{
                          p: 0.5,
                          '&:hover svg': { color: 'gold' },
                        }}
                      >
                        <FaStar
                          color={starValue <= value ? 'gold' : 'lightgray'}
                          size={28}
                          style={{ transition: 'color 0.2s' }}
                        />
                      </IconButton>
                    </motion.div>
                  );
                })}
              </Box>
            )}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose} disabled={isLoading}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Оставить отзыв'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
