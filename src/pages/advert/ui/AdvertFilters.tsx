import { Box, IconButton, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { UserRole } from '../../../entities/user/model';

interface AdvertFiltersProps {
  searchQuery: string;
  typeFilter: UserRole | '';
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export const AdvertFilters: React.FC<AdvertFiltersProps> = ({
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeChange,
}) => (
  <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
    <TextField
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
    <Select value={typeFilter} onChange={onTypeChange} displayEmpty size="small">
      <MenuItem value="">Все типы</MenuItem>
      <MenuItem value={UserRole.STUDENT}>Студент</MenuItem>
      <MenuItem value={UserRole.MENTOR}>Ментор</MenuItem>
    </Select>
  </Box>
);
