import React from 'react';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';

export const ChatList = ({ onSelectChat }) => {
  const { data: chats, isLoading, isError } = useGetChatsQuery();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Ошибка при загрузке чатов</Typography>;

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
      <Typography variant="h6">Список чатов</Typography>
      <List>
        {chats?.data.map(chat => (
          <ListItem button key={chat.id} onClick={() => onSelectChat(chat.id)}>
            <ListItemText primary={chat.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
