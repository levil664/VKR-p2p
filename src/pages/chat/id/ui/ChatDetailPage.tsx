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
import { Link, useParams } from 'react-router';
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
  useGetMeetingUrlQuery,
  useGetMessagesQuery,
  useGetUnreadMessagesQuery,
  useSendMessageMutation,
} from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';
import { CreateReviewModal } from '../../../../features/createReviewModal/ui/CreateReviewModal';

const inputStyles = {
  width: { xs: '100%', sm: '100%', md: 400, lg: 600 },
  maxWidth: '600px',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    color: 'black',
  },
};

const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#64b5f6', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const ChatDetailPage = () => {
  const { chatId } = useParams();
  const [messageText, setMessageText] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [openReviewModal, setOpenReviewModal] = useState(false);

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
  const { data: messagesData } = useGetMessagesQuery({ chatId, pageNumber }, { skip: !chatId });
  const { data: unreadMessagesData } = useGetUnreadMessagesQuery(chatId, { skip: !chatId });
  const { data: subjectsData } = useGetSubjectsQuery();
  const currentUserId = useAppSelector(state => state.user.id);
  const isAuthor = advertData?.data?.creator.id === currentUserId;

  const unreadMessageIds = unreadMessagesData?.data?.map(m => m.id) || [];

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
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
  const selectedSubject = subjectsData?.data?.find(subject => subject.id === selectedSubjectId);

  useEffect(() => {
    setAllMessages([]);
    setPageNumber(0);
  }, [chatId]);

  useEffect(() => {
    if (messagesData?.data?.content) {
      setAllMessages(prevMessages => [
        ...prevMessages.filter(m => !messagesData.data.content.some(newM => newM.id === m.id)),
        ...messagesData.data.content,
      ]);
    }
  }, [messagesData]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
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
      setOpenReviewModal(true);
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

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                sx={inputStyles}
                InputProps={{ readOnly: true }}
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
                sx={inputStyles}
                InputProps={{ readOnly: true }}
              />
            )}
          />
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" required sx={{ maxWidth: 600 }}>
                <InputLabel id="subject-label">Предмет</InputLabel>
                <Select
                  {...field}
                  labelId="subject-label"
                  id="subject"
                  label="Предмет"
                  readOnly
                  IconComponent={() => null}
                  sx={inputStyles}
                >
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
              <FormControl fullWidth margin="normal" required sx={{ maxWidth: 600 }}>
                <InputLabel id="topics-label">Темы</InputLabel>
                <Select
                  {...field}
                  multiple
                  labelId="topics-label"
                  id="topics"
                  label="Темы"
                  readOnly
                  IconComponent={() => null}
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
                  sx={inputStyles}
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
        </form>
        {advertData?.data?.status === 'IN_PROGRESS' && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenVideoCallDialog(true)}
            >
              Создать видеозвонок
            </Button>
            {!isAuthor && (
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenFinalizeDialog(true)}
              >
                Завершить заявку
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Чат с{' '}
          {chatData?.data?.participants
            ?.filter(p => p.id !== currentUserId)
            .map(p => `${p.lastName} ${p.firstName}`)
            .join(', ') || 'Участники не найдены'}
        </Typography>
        <Paper
          ref={messagesContainerRef}
          sx={{
            height: { xs: '40vh', md: '50vh' },
            overflowY: 'auto',
            p: 2,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            backgroundColor: '#f0f2f5',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 1,
          }}
        >
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box ref={topObserverRef} />
            {[...allMessages].reverse().map(message => {
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
                  <ListItemText
                    primary={
                      <>
                        <Typography
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontSize: '1rem',
                          }}
                        >
                          {linkifyText(message.content.text)}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                            alignItems: 'center',
                            mt: 0.5,
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              opacity: 0.7,
                            }}
                          >
                            {formatTime(message.createdOn)}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
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
            onKeyDown={handleKeyDown}
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            sx={{ backgroundColor: '#fff', borderRadius: 2 }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              padding: 0,
              minWidth: 0,
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MdSend size={20} color="white" />
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

      <CreateReviewModal
        open={openReviewModal}
        advertId={advertId}
        onClose={() => setOpenReviewModal(false)}
      />

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

const MeetingLink = ({ meetingId }) => {
  const { data: meetingUrlData, isLoading: isLoadingMeetingUrl } = useGetMeetingUrlQuery(meetingId);

  if (isLoadingMeetingUrl) return <Typography>Загрузка ссылки...</Typography>;

  return (
    <ListItemText
      primary={
        <Typography>
          Создана комната для проведения занятия. Вы можете подключиться по{' '}
          <Link
            to={meetingUrlData?.data}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            ссылке
          </Link>
          .
        </Typography>
      }
    />
  );
};
