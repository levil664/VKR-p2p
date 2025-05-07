import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useGetMentorApplicationsQuery } from '../../../entities/mentorApplication/api/mentorApplicationApi';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { AdvertPagination } from '../../advert/ui/AdvertPagination';
import { MentorApplicationStatusEnum } from '../lib/enums';
import { MentorApplicationCard } from './MentorApplicationCard';
import { MentorApplicationTable } from './MentorApplicationTable';

export const MentorApplication = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const { data, isLoading, isError } = useGetMentorApplicationsQuery({
    state: MentorApplicationStatusEnum.PENDING,
  });

  const applications = data?.data || [];
  const totalPages = Math.ceil(applications.length / pageSize);
  const paginatedApplications = applications.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('viewMode', viewMode);
    setSearchParams(newSearchParams);
  }, [viewMode, searchParams, setSearchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<unknown>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Ошибка при загрузке заявок</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Заявки</Typography>
        <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </Box>

      {applications.length === 0 ? (
        <NoData />
      ) : (
        <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
          {viewMode === 'table' ? (
            <MentorApplicationTable applications={paginatedApplications} />
          ) : (
            paginatedApplications.map(app => (
              <MentorApplicationCard key={app.id} application={app} />
            ))
          )}
        </Box>
      )}

      {applications.length > 0 && (
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
