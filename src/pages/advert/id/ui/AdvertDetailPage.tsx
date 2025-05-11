import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiCheck } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../../app/api';
import {
  useDeleteAdvertMutation,
  useGetAdvertQuery,
  useUpdateAdvertMutation,
} from '../../../../entities/advert/api/advertApi';
import {
  useAcceptAdvertResponseMutation,
  useCreateAdvertResponseMutation,
  useGetAdvertResponsesQuery,
} from '../../../../entities/advertResponse/api/advertResponseApi';
import { useGetMyChatsQuery } from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';
import { NoData } from '../../../../features/noData/ui/NoData';
import { DeleteAdvertDialog } from './DeleteAdvertDialog';

const inputStyles = {
  width: { xs: '100%', sm: '100%', md: 400, lg: 600 },
  maxWidth: '600px',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    color: 'black',
  },
};

export const AdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: advertData, isLoading: isLoadingAdvert } = useGetAdvertQuery(id);
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: chatsData } = useGetMyChatsQuery();
  const { data: responsesData } = useGetAdvertResponsesQuery(id);
  const [createAdvertResponse] = useCreateAdvertResponseMutation();
  const [acceptAdvertResponse] = useAcceptAdvertResponseMutation();
  const [updateAdvert] = useUpdateAdvertMutation();
  const [deleteAdvert] = useDeleteAdvertMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [tabIndex, setTabIndex] = useState(0);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
    },
  });

  const selectedSubjectId = watch('subjectId');

  const isMentor = useAppSelector(state => state.user.isMentor);
  const currentUserId = useAppSelector(state => state.user.id);
  const isAuthor = advertData?.data.creator.id === currentUserId;
  const selectedSubject = subjectsData?.data.find(subject => subject.id === selectedSubjectId);

  const handleAcceptResponse = async (responseId: string) => {
    try {
      await acceptAdvertResponse({ advertId: id, responseId }).unwrap();
      toast.success('Отклик принят!');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при принятии отклика.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAdvert(id).unwrap();
      toast.success('Заявка удалена!');
      navigate('/advert');
    } catch (error) {
      toast.error(
        error.data.message || 'Ошибка при удалении заявки. Пожалуйста, попробуйте еще раз.'
      );
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (advertData) {
      setValue('title', advertData.data.title);
      setValue('description', advertData.data.description);
      setValue('subjectId', advertData.data.subjectId);
      setValue('topicIds', advertData.data.topicIds);
    }
  }, [advertData, setValue]);

  const handleUpdateAdvert = async data => {
    try {
      await updateAdvert({ id, body: data }).unwrap();
      toast.success('Заявка обновлена!');
    } catch (error) {
      toast.error(
        error.data.message || 'Ошибка при обновлении заявки. Пожалуйста, попробуйте еще раз.'
      );
    }
  };

  const handleDeleteAdvert = async () => {
    setOpenDialog(true);
  };

  const handleCreateResponse = async () => {
    try {
      await createAdvertResponse({ advertId: id, body: { description: responseText } }).unwrap();
      setResponseText('');
      toast.success('Отклик отправлен!');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при отправке отклика.');
    }
  };

  if (isLoadingAdvert) return <Typography>Загрузка...</Typography>;

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Заявка: {advertData.data.title}</Typography>
      <Tabs value={tabIndex} onChange={handleChangeTab}>
        <Tab label="Информация" />
        <Tab
          label="Отклики"
          disabled={!isAuthor}
          sx={{
            cursor: !isAuthor ? 'default' : 'pointer',
            color: !isAuthor ? theme.palette.text.disabled : 'inherit',
          }}
        />
      </Tabs>

      <DeleteAdvertDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {tabIndex === 0 && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <form onSubmit={handleSubmit(handleUpdateAdvert)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Заголовок"
                    fullWidth
                    margin="normal"
                    required
                    sx={inputStyles}
                    InputProps={{
                      readOnly: !isAuthor,
                    }}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Описание"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    required
                    sx={inputStyles}
                    InputProps={{
                      readOnly: !isAuthor,
                    }}
                  />
                )}
              />
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" required sx={{ maxWidth: 600 }}>
                    <InputLabel>Предмет</InputLabel>
                    <Select
                      {...field}
                      label="Предмет"
                      sx={{
                        ...inputStyles,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#cfd8dc',
                          },
                          '&:hover fieldset': {
                            borderColor: '#90caf9',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
                      inputProps={{
                        readOnly: !isAuthor,
                      }}
                    >
                      {subjectsData?.data.map(subject => (
                        <MenuItem key={subject.id} value={subject.id} sx={{ color: 'black' }}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="topicIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" required sx={{ maxWidth: 600 }}>
                    <InputLabel>Темы</InputLabel>
                    <Select
                      multiple
                      {...field}
                      label="Темы"
                      sx={{
                        ...inputStyles,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#cfd8dc',
                          },
                          '&:hover fieldset': {
                            borderColor: '#90caf9',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
                      inputProps={{
                        readOnly: !isAuthor,
                      }}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(topicId => (
                            <Chip
                              key={topicId}
                              label={
                                selectedSubject?.topics.find(topic => topic.id === topicId)?.name ||
                                'Неизвестно'
                              }
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {selectedSubject?.topics.map(topic => (
                        <MenuItem key={topic.id} value={topic.id} sx={{ color: 'black' }}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {isAuthor && (
                <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDeleteAdvert}
                    sx={{
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      ml: 2,
                      '&:hover': {
                        borderColor: theme.palette.error.dark,
                        backgroundColor: theme.palette.error.light,
                        color: '#fff',
                      },
                    }}
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Box>
          </form>
          {!isAuthor && (isMentor || advertData?.data?.mentor) && (
            <Box
              sx={{
                mb: 4,
                mt: 1.5,
                p: 3,
                maxWidth: 600,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#f9f9fc',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Заинтересовала заявка?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                Если вас заинтересовала эта заявка — оставьте свой отклик. Напишите, чем можете
                помочь или какие вопросы хотите обсудить.
              </Typography>

              <TextField
                label="Ваш отклик"
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                placeholder="Например: «Готов помочь с темой. Есть опыт преподавания и материалы»"
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#cfd8dc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#90caf9',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />

              <Button
                onClick={handleCreateResponse}
                variant="contained"
                color="primary"
                disabled={!responseText.trim()}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Оставить отклик
              </Button>
            </Box>
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Отклики
          </Typography>

          {responsesData?.data?.length === 0 ? (
            <NoData text="Пока нет откликов на эту заявку" />
          ) : (
            <Stack spacing={2}>
              {responsesData?.data?.map(response => (
                <Box
                  key={response.id}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {response?.respondent?.firstName} {response?.respondent?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(response?.createdOn).toLocaleString('ru-RU')}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {response?.description}
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    {!response.accepted && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAcceptResponse(response?.id)}
                        startIcon={<FiCheck />}
                      >
                        Принять отклик
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/chat/${response?.chatId}`)}
                      sx={{
                        borderColor: theme.palette.info.main,
                        color: theme.palette.info.main,
                        '&:hover': {
                          backgroundColor: theme.palette.info.light,
                          borderColor: theme.palette.info.dark,
                          color: '#fff',
                        },
                      }}
                    >
                      Перейти в чат
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};
