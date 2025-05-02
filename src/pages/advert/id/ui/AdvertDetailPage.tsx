import {
  Box,
  Button,
  Chip,
  Divider,
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
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  useDeleteAdvertMutation,
  useGetAdvertQuery,
  useUpdateAdvertMutation,
} from '../../../../entities/advert/api/advertApi';
import {
  useGetMessagesQuery,
  useGetMyChatsQuery,
  useSendMessageMutation,
} from '../../../../entities/chat/api/chatApi';
import { useGetSubjectsQuery } from '../../../../entities/subjects/api/subjectsApi';

export const AdvertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: advertData, isLoading: isLoadingAdvert } = useGetAdvertQuery(id);
  const { data: subjectsData } = useGetSubjectsQuery();
  const { data: chatsData } = useGetMyChatsQuery();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const { data: messagesData } = useGetMessagesQuery(
    {
      chatId: selectedChatId,
      pageNumber: 0,
      pageSize: 10,
    },
    { skip: !selectedChatId }
  );
  const [updateAdvert] = useUpdateAdvertMutation();
  const [sendMessage] = useSendMessageMutation();
  const [deleteAdvert] = useDeleteAdvertMutation();

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

  if (isLoadingAdvert) return <Typography>Загрузка...</Typography>;

  const selectedSubject = subjectsData?.data.find(
    subject => subject.id === advertData.data.subjectId
  );
  const selectedTopics = selectedSubject
    ? selectedSubject.topics.filter(topic => advertData.data.topicIds.includes(topic.id))
    : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: 2,
          p: 2,
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Заявка: {advertData.data.title}
        </Typography>
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
                          label={selectedTopics.find(topic => topic.id === topicId)?.name}
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
        </form>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: { xs: '100%', sm: '360px' },
          borderRadius: '8px',
          boxShadow: 2,
          p: 2,
          backgroundColor: '#fff',
          flexShrink: 1,
        }}
      >
        <Typography variant="h6">Чаты</Typography>
        <List>
          {chatsData.data.map(chat => (
            <ListItem button key={chat.id} onClick={() => handleChatSelect(chat.id)}>
              <ListItemText
                primary={`Чат с ${chat.participants.map(p => p.firstName).join(', ')}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
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
    </Box>
  );
};
