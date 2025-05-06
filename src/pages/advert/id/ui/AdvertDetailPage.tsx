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
import { useEffect, useRef, useState } from 'react';
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
  useDeleteAdvertResponseMutation,
  useGetAdvertResponsesQuery,
} from '../../../../entities/advertResponse/api/advertResponseApi';
import {
  useGetMessagesQuery,
  useGetMyChatsQuery,
  useGetUnreadMessagesQuery,
  useSendMessageMutation,
} from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';
import { NoData } from '../../../../features/noData/ui/NoData';
import { DeleteAdvertDialog } from './DeleteAdvertDialog';

export const AdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: advertData, isLoading: isLoadingAdvert } = useGetAdvertQuery(id);
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: chatsData } = useGetMyChatsQuery();
  const { data: responsesData } = useGetAdvertResponsesQuery(id);
  const [createAdvertResponse] = useCreateAdvertResponseMutation();
  const [deleteAdvertResponse] = useDeleteAdvertResponseMutation();
  const [acceptAdvertResponse] = useAcceptAdvertResponseMutation();
  const [updateAdvert] = useUpdateAdvertMutation();
  const [deleteAdvert] = useDeleteAdvertMutation();
  const [sendMessage] = useSendMessageMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [allMessages, setAllMessages] = useState([]);
  const messagesContainerRef = useRef();
  const topObserverRef = useRef();
  const bottomRef = useRef(null);
  const pageSize = 10;

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
    },
  });

  const selectedSubjectId = watch('subjectId');

  const { data: messagesData, refetch } = useGetMessagesQuery(
    {
      chatId: selectedChatId,
      pageNumber,
      pageSize,
    },
    { skip: !selectedChatId }
  );

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
    setAllMessages([]);
    setPageNumber(0);
  }, [selectedChatId]);

  useEffect(() => {
    if (!topObserverRef.current) return;

    let timeoutId = null;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          messagesData?.data?.page.number + 1 < messagesData?.data?.page.totalPages
        ) {
          timeoutId = setTimeout(() => {
            setPageNumber(prev => prev + 1);
          }, 1000);
        } else {
          if (timeoutId) clearTimeout(timeoutId);
        }
      },
      { threshold: 1 }
    );

    observer.observe(topObserverRef.current);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [messagesData]);

  useEffect(() => {
    if (messagesData?.data?.content) {
      setAllMessages(prevMessages => [
        ...messagesData.data.content,
        ...prevMessages.filter(m => !messagesData.data.content.some(newM => newM.id === m.id)),
      ]);
    }
  }, [messagesData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView();
    }
  }, [allMessages]);

  useEffect(() => {
    if (advertData) {
      setValue('title', advertData.data.title);
      setValue('description', advertData.data.description);
      setValue('subjectId', advertData.data.subjectId);
      setValue('topicIds', advertData.data.topicIds);
    }
  }, [advertData, setValue]);

  useEffect(() => {
    if (selectedChatId) {
      const interval = setInterval(() => {
        const { data: unreadMessages } = useGetUnreadMessagesQuery(selectedChatId);
        setUnreadMessagesCount(unreadMessages?.data.length || 0);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedChatId]);

  const handleChatSelect = chatId => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      await sendMessage({ chatId: selectedChatId, body: { text: messageText } });
      setMessageText('');
      toast.success('Сообщение отправлено!');
    }
  };

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
        <Box>
          <form onSubmit={handleSubmit(handleUpdateAdvert)}>
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
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiInputBase-input': {
                      color: 'black',
                    },
                  }}
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
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiInputBase-input': {
                      color: 'black',
                    },
                  }}
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
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Предмет</InputLabel>
                  <Select
                    {...field}
                    label="Предмет"
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiInputBase-input': {
                        color: 'black',
                      },
                      '& .MuiMenuItem-root': {
                        color: 'black',
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
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Темы</InputLabel>
                  <Select
                    multiple
                    {...field}
                    label="Темы"
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiInputBase-input': {
                        color: 'black',
                      },
                      '& .MuiMenuItem-root': {
                        color: 'black',
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
          </form>
          {!isAuthor && (
            <Box
              sx={{
                my: 4,
                p: 3,
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

      {/*{tabIndex === 1 && (*/}
      {/*  <Box>*/}
      {/*    <Typography variant="h6">Чаты</Typography>*/}
      {/*    <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>*/}
      {/*      {chatsData.data.map(chat => (*/}
      {/*        <Paper*/}
      {/*          key={chat.id}*/}
      {/*          elevation={selectedChatId === chat.id ? 4 : 1}*/}
      {/*          sx={{*/}
      {/*            p: 2,*/}
      {/*            borderRadius: 2,*/}
      {/*            border: selectedChatId === chat.id ? '2px solid #1976d2' : '1px solid #e0e0e0',*/}
      {/*            cursor: 'pointer',*/}
      {/*            display: 'flex',*/}
      {/*            alignItems: 'center',*/}
      {/*            justifyContent: 'space-between',*/}
      {/*            '&:hover': {*/}
      {/*              border: '2px solid #1976d2',*/}
      {/*            },*/}
      {/*          }}*/}
      {/*          onClick={() => handleChatSelect(chat.id)}*/}
      {/*        >*/}
      {/*          <Typography fontWeight={500}>*/}
      {/*            {`Чат с ${chat.participants.map(p => p.firstName).join(', ')}`}*/}
      {/*          </Typography>*/}
      {/*          {unreadMessagesCount > 0 && (*/}
      {/*            <Chip label={unreadMessagesCount} color="primary" size="small" />*/}
      {/*          )}*/}
      {/*        </Paper>*/}
      {/*      ))}*/}
      {/*    </List>*/}

      {/*    {selectedChatId && (*/}
      {/*      <Box sx={{ mb: 4 }}>*/}
      {/*        <Typography variant="h6" sx={{ mt: 2 }}>*/}
      {/*          Сообщения*/}
      {/*        </Typography>*/}
      {/*        <Paper*/}
      {/*          ref={messagesContainerRef}*/}
      {/*          sx={{*/}
      {/*            maxHeight: '50vh',*/}
      {/*            overflowY: 'auto',*/}
      {/*            p: 2,*/}
      {/*            borderRadius: 2,*/}
      {/*            border: '1px solid #e0e0e0',*/}
      {/*            backgroundColor: '#f0f2f5',*/}
      {/*            display: 'flex',*/}
      {/*            flexDirection: 'column',*/}
      {/*            gap: 1,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>*/}
      {/*            <Box ref={topObserverRef} />*/}
      {/*            {allMessages.map(message => {*/}
      {/*              const isMyMessage = message.senderId === currentUserId;*/}
      {/*              return (*/}
      {/*                <ListItem*/}
      {/*                  key={message.id}*/}
      {/*                  sx={{*/}
      {/*                    backgroundColor: isMyMessage ? '#1976d2' : '#ffffff',*/}
      {/*                    color: isMyMessage ? 'white' : 'black',*/}
      {/*                    borderRadius: 2,*/}
      {/*                    p: 1.5,*/}
      {/*                    border: '1px solid #e0e0e0',*/}
      {/*                    alignSelf: isMyMessage ? 'flex-end' : 'flex-start',*/}
      {/*                    maxWidth: '70%',*/}
      {/*                  }}*/}
      {/*                >*/}
      {/*                  <ListItemText primary={message.content.text} />*/}
      {/*                </ListItem>*/}
      {/*              );*/}
      {/*            })}*/}
      {/*            <div ref={bottomRef} />*/}
      {/*          </List>*/}
      {/*        </Paper>*/}

      {/*        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>*/}
      {/*          <TextField*/}
      {/*            placeholder="Напишите сообщение..."*/}
      {/*            value={messageText}*/}
      {/*            onChange={e => setMessageText(e.target.value)}*/}
      {/*            fullWidth*/}
      {/*            size="small"*/}
      {/*            sx={{ backgroundColor: '#fff', borderRadius: 2 }}*/}
      {/*          />*/}
      {/*          <Button*/}
      {/*            onClick={handleSendMessage}*/}
      {/*            variant="contained"*/}
      {/*            color="primary"*/}
      {/*            sx={{*/}
      {/*              minWidth: 48,*/}
      {/*              minHeight: 48,*/}
      {/*              borderRadius: '50%',*/}
      {/*              p: 0,*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            <MdSend size={24} color="white" />*/}
      {/*          </Button>*/}
      {/*        </Box>*/}
      {/*      </Box>*/}
      {/*    )}*/}
      {/*  </Box>*/}
      {/*)}*/}

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
