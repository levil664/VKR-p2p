import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useGetMyAdvertResponsesQuery } from '../../../entities/advertResponse/api/advertResponseApi';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { AdvertResponseCard } from './AdvertResponseCard';
import { AdvertResponseTable } from './AdvertResponseTable';
import { AdvertPagination } from '../../advert/ui/AdvertPagination';

export const MyAdvertResponses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const { data: responses, isLoading, isError } = useGetMyAdvertResponsesQuery();

  const totalPages = Math.ceil((responses?.data.length || 0) / pageSize);
  const paginatedResponses =
    responses?.data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) || [];

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('viewMode', viewMode);
    setSearchParams(newSearchParams);
  }, [viewMode, searchParams, setSearchParams]);

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

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Ошибка при загрузке откликов</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Мои отклики</Typography>
        <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </Box>
      {responses?.data.length === 0 ? (
        <NoData />
      ) : (
        <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
          {viewMode === 'table' ? (
            <AdvertResponseTable responses={paginatedResponses} />
          ) : (
            paginatedResponses.map(response => (
              <AdvertResponseCard key={response.id} response={response} />
            ))
          )}
        </Box>
      )}
      {responses?.data.length > 0 && (
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
