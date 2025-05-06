import { Box, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useGetMyChatsQuery } from '../../../entities/chat/api/chatApi';
import { ChatCard } from './ChatCard';
import { ChatTable } from './ChatTable';
import { ChatPagination } from './ChatPagination';
import { Loader } from '../../../shared/components/loader/ui/Loader';
import { NoData } from '../../../features/noData/ui/NoData';
import { ViewModeSwitcher } from '../../../features/viewModeSwitcher/ui/ViewModeSwitcher';

export const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get('size')) || 10);
  const [viewMode, setViewMode] = useState<'table' | 'card'>(
    searchParams.get('viewMode') === 'card' ? 'card' : 'table'
  );

  const { data: chats, isLoading, isError } = useGetMyChatsQuery();

  const totalPages = Math.ceil((chats?.data.length || 0) / pageSize);
  const paginatedChats =
    chats?.data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize) || [];

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

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', pageNumber.toString());
    newSearchParams.set('size', pageSize.toString());
    newSearchParams.set('viewMode', viewMode);
    setSearchParams(newSearchParams);
  }, [pageNumber, pageSize, viewMode, setSearchParams]);

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Ошибка при загрузке чатов</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Мои чаты</Typography>
        <ViewModeSwitcher viewMode={viewMode} onChange={handleViewModeChange} />
      </Box>
      {paginatedChats.length === 0 ? (
        <NoData />
      ) : (
        <Box sx={{ display: viewMode === 'table' ? 'block' : 'grid', gap: 3 }}>
          {viewMode === 'table' ? (
            <ChatTable chats={paginatedChats} />
          ) : (
            paginatedChats.map(chat => <ChatCard key={chat.id} chat={chat} />)
          )}
        </Box>
      )}
      {paginatedChats.length > 0 && (
        <ChatPagination
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
