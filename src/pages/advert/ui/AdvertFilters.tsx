import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { UserRole } from '../../../entities/user/model';

interface AdvertFiltersProps {
  searchQuery: string;
  typeFilter: UserRole | '';
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  handleOpen: () => void;
  isMultipleRoles: boolean;
  isMentor: boolean;
}

export const AdvertFilters: React.FC<AdvertFiltersProps> = ({
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeChange,
  handleOpen,
  isMentor,
}) => (
  <Box
    sx={{
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    }}
  >
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        sx={{ width: { xs: '100%', sm: '300px' } }}
        label="Поиск"
        variant="outlined"
        value={searchQuery}
        onChange={onSearchChange}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {isMentor && (
        <Select value={typeFilter} onChange={onTypeChange} displayEmpty size="small">
          <MenuItem value="">Все заявки</MenuItem>
          <MenuItem value={UserRole.STUDENT}>Студенты</MenuItem>
          <MenuItem value={UserRole.MENTOR}>Наставники</MenuItem>
        </Select>
      )}
    </Box>
    <Button variant="contained" color="primary" onClick={handleOpen}>
      Создать заявку
    </Button>
  </Box>
);
