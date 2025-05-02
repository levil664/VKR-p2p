import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  useDeleteAdvertMutation,
  useGetAdvertQuery,
  useUpdateAdvertMutation,
} from '../../../../entities/advert/api/advertApi';
import {
  useGetMyChatsQuery,
  useGetUnreadMessagesQuery,
  useSendMessageMutation,
} from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';
import {
  useCreateAdvertResponseMutation,
  useDeleteAdvertResponseMutation,
  useGetAdvertResponsesQuery,
} from '../../../../entities/advertResponse/api/advertResponseApi';

export const AdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: advertData, isLoading: isLoadingAdvert } = useGetAdvertQuery(id);
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: chatsData } = useGetMyChatsQuery();
  const { data: responsesData } = useGetAdvertResponsesQuery(id);
  const [createAdvertResponse] = useCreateAdvertResponseMutation();
  const [deleteAdvertResponse] = useDeleteAdvertResponseMutation();
  const [updateAdvert] = useUpdateAdvertMutation();
  const [deleteAdvert] = useDeleteAdvertMutation();
  const [sendMessage] = useSendMessageMutation();

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
    },
  });

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

  const handleBack = () => {
    navigate('/advert');
  };

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
      toast.error('Ошибка при обновлении заявки. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleDeleteAdvert = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await deleteAdvert(id).unwrap();
        toast.success('Заявка удалена!');
        navigate('/advert');
      } catch (error) {
        toast.error('Ошибка при удалении заявки. Пожалуйста, попробуйте еще раз.');
      }
    }
  };

  const handleCreateResponse = async () => {
    try {
      await createAdvertResponse({ advertId: id, body: { description: responseText } }).unwrap();
      setResponseText('');
      toast.success('Отклик отправлен!');
    } catch (error) {
      toast.error('Ошибка при отправке отклика. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleDeleteResponse = async responseId => {
    try {
      await deleteAdvertResponse({ advertId: id, responseId }).unwrap();
      toast.success('Отклик удален!');
    } catch (error) {
      toast.error('Ошибка при удалении отклика. Пожалуйста, попробуйте еще раз.');
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
          </form>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6">Чаты</Typography>
          <List>
            {chatsData.data.map(chat => (
              <ListItem button key={chat.id} onClick={() => handleChatSelect(chat.id)}>
                <ListItemText
                  primary={`Чат с ${chat.participants.map(p => p.firstName).join(', ')}`}
                />
                {unreadMessagesCount > 0 && (
                  <Chip label={unreadMessagesCount} color="secondary" size="small" />
                )}
              </ListItem>
            ))}
          </List>
          {selectedChatId && (
            <Box>
              <Typography variant="h6">Сообщения</Typography>
              <Paper sx={{ maxHeight: 400, overflow: 'auto', borderRadius: '8px', p: 1 }}>
                <List>
                  {messagesData?.data.map(message => (
                    <ListItem key={message.id}>
                      <ListItemText primary={message.content.text} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              <TextField
                label="Ваше сообщение"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleSendMessage} variant="contained" color="primary">
                Отправить
              </Button>
            </Box>
          )}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6">Отклики</Typography>
          <List>
            {responsesData?.data.map(response => (
              <ListItem key={response.id}>
                <ListItemText primary={response.description} />
                <Chip
                  label={response.accepted ? 'Принят' : 'Ожидает'}
                  color={response.accepted ? 'success' : 'default'}
                />
                <Button onClick={() => handleDeleteResponse(response.id)} color="error">
                  Удалить
                </Button>
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
