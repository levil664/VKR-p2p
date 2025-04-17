import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAppSelector } from '../../../app/api';
import {
  useCreateAdvertMutation,
  useGetAdvertsQuery,
} from '../../../entities/advert/api/advertApi';
import { CreateAdvertRequest } from '../../../entities/advert/model';
import { UserRole } from '../../../entities/user/model';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { useDebounce } from '../../../shared/lib';
import { AdvertCard } from './AdvertCard';
import { AdvertFilters } from './AdvertFilters';
import { AdvertPagination } from './AdvertPagination';
import { AdvertTable } from './AdvertTable';
import { CreateAdvertModal } from './CreateAdvertModal';
import { RoleEnum } from '../../../entities/user/model/enums';

export const Advert = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserRole | ''>('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [createAdvert] = useCreateAdvertMutation();
  const {
    data: adverts,
    isLoading,
    isError,
  } = useGetAdvertsQuery({
    query: debouncedSearchQuery || '',
    type: typeFilter || undefined,
    pageNumber: pageNumber - 1,
    pageSize,
  });

  const userRole = useAppSelector(state => state.user.role);
  const isMultipleRoles = Array.isArray(userRole);

  useEffect(() => {
    if (isMultipleRoles) {
      setTypeFilter(UserRole.STUDENT);
    } else if (typeof userRole === 'string') {
      const roleFromEnum = Object.entries(RoleEnum).find(([_, val]) => val === userRole);
      if (roleFromEnum) {
        setTypeFilter(roleFromEnum[0] as UserRole);
      }
    }
  }, [userRole, isMultipleRoles]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('viewMode', viewMode);
    setSearchParams(newSearchParams);
  }, [viewMode, searchParams, setSearchParams]);

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
      const requestBody = formData;
      await createAdvert(requestBody).unwrap();
      handleClose();
    } catch (error) {
      console.error('Failed to create advert:', error);
    }
  };

  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
  };

  const filteredApplications =
    adverts?.data?.content?.filter(advert => advert.status === 'ACTIVE') || [];

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Ошибка при загрузке заявок</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 3, gap: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Заявки</Typography>
          <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
        </Box>
        <AdvertFilters
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          onSearchChange={handleSearchChange}
          onTypeChange={handleTypeChange}
          isMultipleRoles={isMultipleRoles}
          handleOpen={handleOpen}
        />
        {filteredApplications.length === 0 ? (
          <NoData />
        ) : (
          <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
            {viewMode === 'table' ? (
              <AdvertTable adverts={filteredApplications} />
            ) : (
              filteredApplications.map(app => <AdvertCard key={app.id} advert={app} />)
            )}
          </Box>
        )}

        {filteredApplications.length !== 0 && (
          <AdvertPagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalPages={adverts?.data?.page?.totalPages || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Box>

      <CreateAdvertModal open={open} onClose={handleClose} onSubmit={onSubmit} />
    </Box>
  );
};
