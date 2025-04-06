import { Box, Button, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';
import {
  useCreateAdvertMutation,
  useGetAdvertsQuery,
} from '../../../entities/advert/api/advertApi';
import { AdvertStatus, CreateAdvertRequest } from '../../../entities/advert/model';
import { UserRole } from '../../../entities/user/model';
import { useDebounce } from '../../../shared/lib';
import { AdvertCard } from './AdvertCard';
import { AdvertFilters } from './AdvertFilters';
import { AdvertPagination } from './AdvertPagination';
import { CreateAdvertModal } from './CreateAdvertModal';
import { useAppSelector } from '../../../app/api';

export const Advert = () => {
  const [filters, setFilters] = useState({
    status: {
      [AdvertStatus.IN_PROGRESS]: true,
      [AdvertStatus.COMPLETED]: true,
      [AdvertStatus.CANCELLED]: true,
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserRole | ''>('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [createAdvert] = useCreateAdvertMutation();
  const {
    data: adverts,
    isLoading,
    isError,
  } = useGetAdvertsQuery({
    query: debouncedSearchQuery,
    type: typeFilter || undefined,
    pageNumber,
    pageSize,
  });

  const userRole = useAppSelector(state => state.user.role);
  const isMultipleRoles = Array.isArray(userRole);

  React.useEffect(() => {
    if (isMultipleRoles) {
      setTypeFilter(UserRole.STUDENT);
    } else {
      setTypeFilter(userRole);
    }
  }, [userRole, isMultipleRoles]);

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
    setTypeFilter(event.target.value as UserRole | '');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<unknown>) => {
    setPageSize(event.target.value as number);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <AdvertFilters
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          onSearchChange={handleSearchChange}
          onTypeChange={handleTypeChange}
          isMultipleRoles={isMultipleRoles}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {filteredApplications
            .filter(app => {
              if (userRole === UserRole.STUDENT) {
                return app.type === UserRole.MENTOR;
              }
              if (userRole === UserRole.MENTOR) {
                return app.type === UserRole.STUDENT;
              }
              return true;
            })
            .map(app => (
              <AdvertCard key={app.id} advert={app} />
            ))}
        </Box>
        <AdvertPagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={adverts?.data?.totalPages || 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      <CreateAdvertModal open={open} onClose={handleClose} onSubmit={onSubmit} />
    </Box>
  );
};
