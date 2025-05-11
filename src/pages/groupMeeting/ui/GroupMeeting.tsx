import { Box, Button, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import {
  useCreateGroupMeetingMutation,
  useGetGroupMeetingsQuery,
} from '../../../entities/groupMeetings/api';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { CreateGroupMeetingModal } from './CreateGroupMeetingModal';
import { GroupMeetingCard } from './GroupMeetingCard';
import { GroupMeetingPagination } from './GroupMeetingPagination';
import { GroupMeetingTable } from './GroupMeetingTable';
import { useAppSelector } from '../../../app/api';

const inputStyles = {
  width: { xs: '100%', sm: '100%', lg: 600 },
  maxWidth: '600px',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    color: 'black',
  },
};

export const GroupMeeting = () => {
  const isMentor = useAppSelector(state => state.user.isMentor);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const [createGroupMeeting] = useCreateGroupMeetingMutation();
  const {
    data: groupMeetings,
    isLoading,
    isError,
  } = useGetGroupMeetingsQuery({
    pageNumber: pageNumber - 1,
    pageSize,
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('viewMode', viewMode);
    setSearchParams(newSearchParams);
  }, [viewMode, searchParams, setSearchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageNumber(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(event.target.value as number);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async formData => {
    try {
      await createGroupMeeting(formData).unwrap();
      handleClose();
      toast.success('Групповое занятие успешно создано!');
    } catch (error) {
      toast.error(error.data.message || 'Ошибка при создании группового занятия');
    }
  };

  const handleViewModeChange = (mode: 'table' | 'card') => {
    setViewMode(mode);
  };

  if (isLoading) return <Loader />;
  if (isError) return <NoData />;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 3, gap: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Групповые занятия</Typography>
          <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
        </Box>
        {isMentor && (
          <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
            Создать групповое занятие
          </Button>
        )}
        {groupMeetings?.data?.content.length === 0 ? (
          <NoData />
        ) : (
          <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
            {viewMode === 'table' ? (
              <GroupMeetingTable groupMeetings={groupMeetings.data.content} />
            ) : (
              groupMeetings.data.content.map(meeting => (
                <GroupMeetingCard key={meeting.id} meeting={meeting} />
              ))
            )}
          </Box>
        )}
        {groupMeetings?.data?.content.length !== 0 && (
          <GroupMeetingPagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalPages={groupMeetings?.data?.totalPages || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Box>

      <CreateGroupMeetingModal open={open} onClose={handleClose} onSubmit={onSubmit} />
    </Box>
  );
};
