import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Skeleton,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDataGrid = styled(Paper)(({ theme }) => ({
  width: '100%',
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
}));

const SkeletonRow = ({ columns }) => (
  <TableRow>
    {columns.map((_column, index) => (
      <TableCell key={index}>
        <Skeleton variant="text" width="80%" />
      </TableCell>
    ))}
  </TableRow>
);

const CustomDataGrid = ({
  rows = [],
  columns = [],
  loading = false,
  pagesize = 5,
  pageSizeOptions = [5, 10, 25],
  sortable = true,
  onRowClick,
  title,
  subtitle,
  actions,
  sx = {},
  ...props
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagesize);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    if (!sortable) return;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    const column = columns.find(col => col.field === orderBy);

    let aValue, bValue;

    if (column && column.valueGetter) {
      if (orderBy === 'checkIn' || orderBy === 'checkOut') {
        aValue = orderBy === 'checkIn' ?
          (a.checkIn || a.startDate) :
          (a.checkOut || a.endDate);
        bValue = orderBy === 'checkOut' ?
          (a.checkIn || a.startDate) :
          (a.checkOut || a.endDate);
      } else if (orderBy === 'guests') {
        aValue = a.guests || a.noOfRooms || 0;
        bValue = b.guests || b.noOfRooms || 0;
      } else if (orderBy === 'rooms') {
        aValue = a.rooms || a.noOfRooms || 0;
        bValue = a.rooms || b.noOfRooms || 0;
      } else {
        aValue = a[orderBy];
        bValue = b[orderBy];
      }
    }

    const isDateField = orderBy.includes('Date') || orderBy.includes('checkIn') || orderBy.includes('checkOut');
    if (isDateField && aValue !== '' && bValue !== '') {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);

      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
    }

    const numA = Number(aValue);
    const numB = Number(bValue);
    if (!isNaN(numA) && !isNaN(numB) && aValue !== '' && bValue !== '') {
      return numB - numA;
    }

    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedAndPaginatedRows = useMemo(() => {
    if (!rows.length) return [];

    let sortedRows = rows;
    if (orderBy && sortable) {
      sortedRows = stableSort(rows, getComparator(order, orderBy));
    }
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedRows.slice(start, end);
  }, [rows, orderBy, sortable, page, rowsPerPage, getComparator, order]);

  const renderCellContent = (row, column) => {
    if (column.renderCell) {
      return column.renderCell({ row, value: row[column.field] });
    }
    if (column.valueGetter) {
      return column.valueGetter({ row });
    }
    return row[column.field] || '';
  };

  return (
    <Box sx={sx}>
      {(title || subtitle || actions) && (
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="h2" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
      )}

      <StyledDataGrid elevation={1}>
        <TableContainer>
          <Table {...props}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth || column.width }}
                    sortDirection={orderBy === column.field ? order : false}
                  >
                    {column.sortable !== false && sortable ? (
                      <TableSortLabel
                        active={orderBy === column.field}
                        direction={orderBy === column.field ? order : 'asc'}
                        onClick={() => handleRequestSort(column.field)}
                      >
                        {column.headerName || column.field}
                      </TableSortLabel>
                    ) : (
                      column.headerName || column.field
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <SkeletonRow key={index} columns={columns} />
                ))
              ) : sortedAndPaginatedRows.length > 0 ? (
                sortedAndPaginatedRows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.field} align={column.align || 'left'}>
                        {renderCellContent(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'grey.50',
          }}
        />
      </StyledDataGrid>
    </Box>
  );
};

export default CustomDataGrid;
