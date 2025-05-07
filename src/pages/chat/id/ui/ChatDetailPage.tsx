import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdSend } from 'react-icons/md';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../../app/api';
import {
  useFinalizeAdvertMutation,
  useGetAdvertQuery,
  useUpdateAdvertMutation,
} from '../../../../entities/advert/api/advertApi';
import {
  useCreateVideoCallMutation,
  useGetChatQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';

export const ChatDetailPage = () => {
  const { chatId } = useParams();
  const [messageText, setMessageText] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const bottomRef = useRef(null);
  const topObserverRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [sendMessage] = useSendMessageMutation();
  const [updateAdvert] = useUpdateAdvertMutation();
  const [finalizeAdvert] = useFinalizeAdvertMutation();
  const [createVideoCall] = useCreateVideoCallMutation();

  const { data: chatData, isLoading: isChatLoading } = useGetChatQuery(chatId, { skip: !chatId });
  const advertId = chatData?.data?.advertId;
  const { data: advertData, isLoading: isAdvertLoading } = useGetAdvertQuery(advertId, {
    skip: !advertId,
  });
  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(
    { chatId, pageNumber, pageSize: 20 },
    { skip: !chatId }
  );
  const { data: subjectsData } = useGetSubjectsQuery();
  const currentUserId = useAppSelector(state => state.user.id);
  const isAuthor = advertData?.data.creator.id === currentUserId;

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: advertData?.data.title || '',
      description: advertData?.data.description || '',
      subjectId: advertData?.data.subjectId || '',
      topicIds: advertData?.data.topicIds || [],
    },
  });

  const [openFinalizeDialog, setOpenFinalizeDialog] = useState(false);
  const [openVideoCallDialog, setOpenVideoCallDialog] = useState(false);

  useEffect(() => {
    if (advertData?.data) {
      setValue('title', advertData.data.title);
      setValue('description', advertData.data.description);
      setValue('subjectId', advertData.data.subjectId);
      setValue('topicIds', advertData.data.topicIds);
    }
  }, [advertData, setValue]);

  const selectedSubjectId = watch('subjectId');
  const selectedSubject = subjectsData?.data.find(subject => subject.id === selectedSubjectId);

  useEffect(() => {
    setAllMessages([]);
    setPageNumber(0);
  }, [chatId]);

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
    if (!topObserverRef.current) return;

    let timeoutId = null;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          messagesData?.data?.page?.number + 1 < messagesData?.data?.page?.totalPages
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

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      await sendMessage({ chatId, body: { text: messageText } });
      setMessageText('');
    }
  };

  const handleUpdateAdvert = async data => {
    try {
      await updateAdvert({ id: advertId, body: data }).unwrap();
      toast.success('Заявка обновлена!');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при обновлении заявки.');
    }
  };

  const handleFinalizeAdvert = async () => {
    try {
      await finalizeAdvert(advertId).unwrap();
      toast.success('Заявка завершена!');
      setOpenFinalizeDialog(false);
    } catch (error) {
      toast.error(error.data.message || 'Не удалось завершить заявку.');
    }
  };

  const handleCreateVideoCall = async () => {
    try {
      await createVideoCall({ chatId }).unwrap();
      toast.success('Видеозвонок создан!');
      setOpenVideoCallDialog(false);
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при создании видеозвонка.');
    }
  };

  if (isChatLoading || isAdvertLoading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">Информация о заявке</Typography>
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
                InputProps={{ readOnly: !isAuthor }}
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
                InputProps={{ readOnly: !isAuthor }}
              />
            )}
          />
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Предмет</InputLabel>
                <Select {...field} inputProps={{ readOnly: !isAuthor }}>
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
        </form>
        {isAuthor && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenVideoCallDialog(true)}
            >
              Создать видеозвонок
            </Button>
            <Button variant="contained" color="success" onClick={() => setOpenFinalizeDialog(true)}>
              Завершить заявку
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Чат с{' '}
          {chatData.data.participants
            .filter(p => p.id !== currentUserId)
            .map(p => `${p.lastName} ${p.firstName}`)
            .join(', ')}
        </Typography>
        <Paper
          ref={messagesContainerRef}
          sx={{
            maxHeight: { xs: '40vh', md: '50vh' },
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

      <Dialog open={openFinalizeDialog} onClose={() => setOpenFinalizeDialog(false)}>
        <DialogTitle>Завершить заявку?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите завершить эту заявку? Это действие необратимо.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFinalizeDialog(false)}>Отмена</Button>
          <Button onClick={handleFinalizeAdvert} color="success" variant="contained">
            Завершить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openVideoCallDialog} onClose={() => setOpenVideoCallDialog(false)}>
        <DialogTitle>Создать видеозвонок?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Будет отправлено уведомление в чат о начале видеозвонка.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVideoCallDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateVideoCall} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
