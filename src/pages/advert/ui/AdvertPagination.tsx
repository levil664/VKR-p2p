import { Box, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';

interface AdvertPaginationProps {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onPageSizeChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
}

export const AdvertPagination: React.FC<AdvertPaginationProps> = ({
  pageNumber,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => (
  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Pagination count={totalPages} page={pageNumber} onChange={onPageChange} size="small" />
    <Select
      value={pageSize}
      onChange={onPageSizeChange}
      sx={{ minWidth: 100, height: '32px' }}
      size="small"
    >
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={20}>20</MenuItem>
      <MenuItem value={50}>50</MenuItem>
    </Select>
  </Box>
);
