import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { CreateAdvertRequest } from '../../../entities/advert/model';
import { useGetSubjectsQuery } from '../../../entities/subjects/api/subjectsApi';
import { UserRole } from '../../../entities/user/model';

interface CreateAdvertModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdvertRequest) => void;
}

export const CreateAdvertModal: React.FC<CreateAdvertModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm<CreateAdvertRequest>({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
      type: UserRole.STUDENT,
    },
  });

  const { data: response, isLoading } = useGetSubjectsQuery();
  const subjects = response?.data;

  const selectedSubjectId = watch('subjectId');
  const selectedTopics = watch('topicIds');

  const handleFormSubmit = (data: CreateAdvertRequest) => {
    const formattedData: CreateAdvertRequest = {
      title: data.title,
      description: data.description,
      subjectId: data.subjectId,
      topicIds: data.topicIds,
      type: data.type,
    };

    onSubmit(formattedData);
    reset();
    onClose();
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setValue('subjectId', event.target.value);
    setValue('topicIds', []);
  };

  const handleTopicsChange = (event: SelectChangeEvent<string[]>) => {
    setValue('topicIds', event.target.value as string[]);
  };

  const selectedSubject = subjects?.find(subject => subject.id === selectedSubjectId);

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (!subjects) {
    return <Typography>Ошибка при загрузке данных</Typography>;
  }

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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Создать заявку
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Предмет</InputLabel>
            <Select value={selectedSubjectId} onChange={handleSubjectChange} label="Предмет">
              {subjects.map(subject => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSubject && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Темы</InputLabel>
              <Select
                multiple
                value={selectedTopics}
                onChange={handleTopicsChange}
                label="Темы"
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map(topicId => (
                      <Chip
                        key={topicId}
                        label={selectedSubject.topics.find(topic => topic.id === topicId)?.name}
                      />
                    ))}
                  </Box>
                )}
              >
                {selectedSubject.topics.map(topic => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Тип"
                fullWidth
                margin="normal"
                select
                SelectProps={{ native: true }}
                required
              >
                <option value={UserRole.STUDENT}>Студент</option>
                <option value={UserRole.MENTOR}>Ментор</option>
              </TextField>
            )}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              Создать
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
