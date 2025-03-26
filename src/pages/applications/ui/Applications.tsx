import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { mockApplications } from '../model/mock';

export const Applications = () => {
  const [filters, setFilters] = useState({
    status: {
      В_обработке: true,
      Выполнено: true,
      Отменено: true,
    },
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

  const filteredApplications = mockApplications.filter(
    app => filters.status[app.status.replace(' ', '_')]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 3, gap: 3 }}>
      <Paper sx={{ width: { xs: '100%', md: '250px' }, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Фильтры
        </Typography>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.В_обработке}
                  onChange={handleFilterChange}
                  name="В_обработке"
                />
              }
              label="В обработке"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.Выполнено}
                  onChange={handleFilterChange}
                  name="Выполнено"
                />
              }
              label="Выполнено"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.status.Отменено}
                  onChange={handleFilterChange}
                  name="Отменено"
                />
              }
              label="Отменено"
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Заявки
        </Typography>
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
                  Дата: {app.date}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
