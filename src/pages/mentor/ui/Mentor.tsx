import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { MentorCard } from './MentorCard';
import { MentorPagination } from './MentorPagination';
import { MentorTable } from './MentorTable';
import { useGetMentorsQuery } from '../../../entities/mentorApplication/api/mentorApplicationApi';

export const Mentor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const { data: mentors, isLoading, isError } = useGetMentorsQuery();

  const totalPages = Math.ceil((mentors?.data.length || 0) / pageSize);
  const paginatedMentors =
    mentors?.data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) || [];

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
  if (isError) return <Typography>Ошибка при загрузке наставников</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Наставники</Typography>
        <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </Box>
      {mentors?.data.length === 0 ? (
        <NoData />
      ) : (
        <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
          {viewMode === 'table' ? (
            <MentorTable mentors={paginatedMentors} />
          ) : (
            paginatedMentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)
          )}
        </Box>
      )}
      {mentors?.data.length > 0 && (
        <MentorPagination
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
