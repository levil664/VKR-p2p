import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetMyAdvertsQuery } from '../../../entities/advert/api/advertApi';
import { UserRole } from '../../../entities/user/model';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { AdvertCard } from '../../advert/ui/AdvertCard';
import { AdvertPagination } from '../../advert/ui/AdvertPagination';
import { AdvertTable } from '../../advert/ui/AdvertTable';

export const MyAdverts = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const { data: adverts, isLoading, isError } = useGetMyAdvertsQuery();

  const filteredAdverts = selectedRole
    ? adverts?.data?.filter(advert => advert.type === selectedRole) || []
    : adverts?.data || [];

  const totalPages = Math.ceil(filteredAdverts.length / pageSize);
  const paginatedAdverts =
    filteredAdverts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) || [];

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    setPageSize(event.target.value as number);
    setPageNumber(1);
  };

  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
  };

  const handleRoleChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    setSelectedRole(event.target.value as UserRole | '');
    setPageNumber(1);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Ошибка при загрузке заявок</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Мои заявки</Typography>
        <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          displayEmpty
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Все роли</MenuItem>
          <MenuItem value={UserRole.STUDENT}>Студент</MenuItem>
          <MenuItem value={UserRole.TEACHER}>Преподаватель</MenuItem>
        </Select>
      </Box>
      {filteredAdverts.length === 0 ? (
        <NoData />
      ) : (
        <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
          {viewMode === 'table' ? (
            <AdvertTable adverts={paginatedAdverts} />
          ) : (
            paginatedAdverts.map(advert => <AdvertCard key={advert.id} advert={advert} />)
          )}
        </Box>
      )}
      {filteredAdverts.length > 0 && (
        <AdvertPagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Box>
  );
};
