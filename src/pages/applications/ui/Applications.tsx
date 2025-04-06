import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { CreateAdvertRequest } from '../../../entities/advert/model';
import {
  useCreateAdvertMutation,
  useGetAdvertsQuery,
} from '../../../entities/advert/api/advertApi';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../../../shared/lib';

export const Applications = () => {
  const [filters, setFilters] = useState({
    status: {
      В_обработке: true,
      Выполнено: true,
      Отменено: true,
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'STUDENT' | 'MENTOR' | ''>('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<CreateAdvertRequest>({
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      topicIds: [],
      type: 'STUDENT',
    },
  });
  const [createAdvert] = useCreateAdvertMutation();
  const {
    data: adverts,
    isLoading,
    isError,
  } = useGetAdvertsQuery({
    query: debouncedSearchQuery,
    type: typeFilter,
    pageNumber,
    pageSize,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      status: {
        ...filters.status,
        [event.target.name]: event.target.checked,
      },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTypeFilter(event.target.value as 'STUDENT' | 'MENTOR' | '');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPageSize(event.target.value as number);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (formData: CreateAdvertRequest) => {
    try {
      const requestBody = { data: formData };
      await createAdvert(requestBody).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to create advert:', error);
    }
  };

  const filteredApplications =
    adverts?.data?.content?.filter(app => filters.status[app.status.replace(' ', '_')]) || [];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке заявок</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 3, gap: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Заявки</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Создать заявку
          </Button>
        </Box>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Поиск"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Select value={typeFilter} onChange={handleTypeChange} displayEmpty size="small">
            <MenuItem value="">Все типы</MenuItem>
            <MenuItem value="STUDENT">Студент</MenuItem>
            <MenuItem value="MENTOR">Ментор</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {filteredApplications.map(app => (
            <Card key={app.id}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {app.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {app.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Статус: {app.status}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Дата: {app.createdOn}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pagination
            count={adverts?.data?.totalPages || 1}
            page={pageNumber}
            onChange={handlePageChange}
          />
          <Select value={pageSize} onChange={handlePageSizeChange} sx={{ minWidth: 100 }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Создать заявку
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                <TextField {...field} label="ID предмета" fullWidth margin="normal" required />
              )}
            />
            <Controller
              name="topicIds"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID тем (через запятую)"
                  fullWidth
                  margin="normal"
                  required
                  onChange={e => {
                    const value = e.target.value.split(',').map(item => item.trim());
                    field.onChange(value);
                  }}
                />
              )}
            />
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
                  <option value="STUDENT">Студент</option>
                  <option value="MENTOR">Ментор</option>
                </TextField>
              )}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleClose}>Отмена</Button>
              <Button type="submit" variant="contained" color="primary">
                Создать
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};
