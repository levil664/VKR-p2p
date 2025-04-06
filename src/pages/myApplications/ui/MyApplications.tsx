import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { mockApplications } from '../model/mock';

export const MyApplications = () => {
  const [filters, setFilters] = useState({
    В_обработке: true,
    Выполнено: true,
    Отменено: true,
  });

  const [searchText, setSearchText] = useState('');
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: 'date',
      sort: 'asc',
    },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  const filteredApplications = mockApplications
    .filter(app => filters[app.status.replace(' ', '_')])
    .filter(
      app =>
        app.title.toLowerCase().includes(searchText.toLowerCase()) ||
        app.description.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: isMobile ? 50 : 90 },
    { field: 'title', headerName: 'Заголовок', width: isMobile ? 150 : 200 },
    { field: 'description', headerName: 'Описание', width: isMobile ? 200 : 300 },
    { field: 'status', headerName: 'Статус', width: isMobile ? 100 : 150 },
    { field: 'date', headerName: 'Дата', width: isMobile ? 100 : 150 },
  ];

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
                  checked={filters.В_обработке}
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
                  checked={filters.Выполнено}
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
                  checked={filters.Отменено}
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
        <TextField
          fullWidth
          label="Поиск"
          variant="outlined"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Box sx={{ height: 500, width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={filteredApplications}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            sortModel={sortModel}
            onSortModelChange={model => setSortModel(model)}
          />
        </Box>
      </Box>
    </Box>
  );
};
