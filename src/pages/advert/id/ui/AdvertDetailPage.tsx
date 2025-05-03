import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
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
import { useAppSelector } from '../../../../app/api';
import { MdSend } from 'react-icons/md';
import { FiCheck, FiTrash2 } from 'react-icons/fi';

export const AdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      toast.error('Ошибка при отправке отклика.');
    }
  };

  const handleDeleteResponse = async responseId => {
    try {
      await deleteAdvertResponse({ advertId: id, responseId }).unwrap();
      toast.success('Отклик удален!');
    } catch (error) {
      toast.error(
        error.data.message || 'Ошибка при удалении отклика. Пожалуйста, попробуйте еще раз.'
      );
    }
  };

  if (isLoadingAdvert) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Заявка: {advertData.data.title}</Typography>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
        <Tab label="Информация" />
        <Tab label="Чат" />
        <Tab label="Отклики" />
      </Tabs>
      {tabIndex === 0 && (
        <Box>
          <form onSubmit={handleSubmit(handleUpdateAdvert)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Заголовок" fullWidth margin="normal" required />
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
                />
              )}
            />
            <Controller
              name="subjectId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Предмет</InputLabel>
                  <Select {...field} label="Предмет">
                    {subjectsData?.data.map(subject => (
                      <MenuItem key={subject.id} value={subject.id}>
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
                      <MenuItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Сохранить
            </Button>
            <Button
              variant="outlined"
              onClick={handleDeleteAdvert}
              sx={{
                borderColor: theme => theme.palette.error.main,
                color: theme => theme.palette.error.main,
                '&:hover': {
                  borderColor: theme => theme.palette.error.dark,
                  backgroundColor: theme => theme.palette.error.light,
                  color: '#fff',
                },
                ml: 2,
              }}
            >
              Удалить
            </Button>

            <Dialog open={openDialog} onClose={handleCancelDelete}>
              <DialogTitle>Подтверждение удаления</DialogTitle>
              <DialogContent>
                <Typography>
                  Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Отменить
                </Button>
                <Button onClick={handleConfirmDelete} color="error">
                  Удалить
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6">Чаты</Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {chatsData.data.map(chat => (
              <Paper
                key={chat.id}
                elevation={selectedChatId === chat.id ? 4 : 1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: selectedChatId === chat.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    border: '2px solid #1976d2',
                  },
                }}
                onClick={() => handleChatSelect(chat.id)}
              >
                <Typography fontWeight={500}>
                  {`Чат с ${chat.participants.map(p => p.firstName).join(', ')}`}
                </Typography>
                {unreadMessagesCount > 0 && (
                  <Chip label={unreadMessagesCount} color="primary" size="small" />
                )}
              </Paper>
            ))}
          </List>

          {selectedChatId && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Сообщения
              </Typography>
              <Paper
                ref={messagesContainerRef}
                sx={{
                  maxHeight: '50vh',
                  overflowY: 'auto',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f0f2f5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box ref={topObserverRef} />
                  {allMessages.map(message => {
                    const isMyMessage = message.senderId === currentUserId;
                    return (
                      <ListItem
                        key={message.id}
                        sx={{
                          backgroundColor: isMyMessage ? '#1976d2' : '#ffffff',
                          color: isMyMessage ? 'white' : 'black',
                          borderRadius: 2,
                          p: 1.5,
                          border: '1px solid #e0e0e0',
                          alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                        }}
                      >
                        <ListItemText primary={message.content.text} />
                      </ListItem>
                    );
                  })}
                  <div ref={bottomRef} />
                </List>
              </Paper>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  placeholder="Напишите сообщение..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ backgroundColor: '#fff', borderRadius: 2 }}
                />
                <Button
                  onClick={handleSendMessage}
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: 48,
                    minHeight: 48,
                    borderRadius: '50%',
                    p: 0,
                  }}
                >
                  <MdSend size={24} color="white" />
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6">Отклики</Typography>

          <List>
            {responsesData?.data.map(response => (
              <ListItem
                key={response.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  borderBottom: '1px solid #e0e0e0',
                  py: 1.5,
                }}
              >
                <ListItemText primary={response.description} />

                <Chip
                  label={response.accepted ? 'Принят' : 'Ожидает'}
                  color={response.accepted ? 'success' : 'default'}
                  sx={{ mr: 1 }}
                />

                <Stack direction="row" spacing={1.5}>
                  {!response.accepted && (
                    <Button
                      onClick={() => handleAcceptResponse(response.id)}
                      variant="contained"
                      color="primary"
                      startIcon={<FiCheck size={18} />}
                      sx={{
                        textTransform: 'none',
                        px: 2.5,
                        py: 1,
                        minWidth: 'auto',
                      }}
                    >
                      Принять
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteResponse(response.id)}
                    variant="outlined"
                    color="error"
                    startIcon={<FiTrash2 size={18} />}
                    sx={{
                      textTransform: 'none',
                      px: 2.5,
                      py: 1,
                      minWidth: 'auto',
                      '&:hover': {
                        borderColor: theme => theme.palette.error.dark,
                        backgroundColor: theme => theme.palette.error.light,
                        color: '#fff',
                      },
                    }}
                  >
                    Удалить
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
          <TextField
            label="Ваш отклик"
            value={responseText}
            onChange={e => setResponseText(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleCreateResponse} variant="contained" color="primary">
            Отправить отклик
          </Button>
        </Box>
      )}
    </Box>
  );
};
