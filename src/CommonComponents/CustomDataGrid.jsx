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
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo, useState } from 'react';

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

/**
 * CustomDataGrid – A reusable, generic data grid component with sorting and pagination.
 *
 * Column Configuration Options:
 * field: string - The field name in the data row object
 * headerName: string - Display name for the column header
 * width: number - Column width in pixels
 * sortable: boolean - Whether the column is sortable (default: true)
 * valueGetter: function(row) - Function to derive the display value from the row data
 * sortValueGetter: function(row) - Function to get value specifically used for sorting (if different from displayed value)
 * sortComparator: function(a, b, order) - Custom sorting function for complex sorting logic
 * renderCell: function({ row, value }) - Custom cell renderer (e.g., for buttons, styled text, or icons)
 * align: 'left' | 'center' | 'right' - Text alignment in the cell
 * minWidth: number - Minimum width the column can shrink to

// Grid Props:

* @param {Array} rows - The data rows to be displayed in the grid
* @param {Array} columns - Array of column configuration objects
* @param {boolean} loading - Whether to show a loading/skeleton view
* @param {number} pageSize - Default number of rows per page (default: 5)
* @param {Array} pageSizeOptions -  Options for page sizes the user can select (default: [5, 10, 25])
* @param {boolean }sortable - Global setting to enable/disable sorting for all columns (default: true)
* @param {function} onRowClickCallback - Callback function when a row is clicked (optional)
* @param {string} title - Title of the grid (displayed above the table)
* @param {string} subtitle - Subtitle shown below the title, for extra context
* @param {ReactNode} actions - Optional React elements (e.g., buttons) displayed in the grid header (top-right)
* @param {boolean} checkboxSelection - Enable checkbox selection (default: false)
* @param {Array} selectedRows - Arrays of selected row IDs
* @param {function} onSelectionChange - Callback when selection changes (selectedIds) => void
* @param {string} rowIdField - Field name to use as row Id (default: 'id')
*/


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
  checkboxSelection = false,
  selectedRows = [],
  onSelectionChange,
  rowIdField = 'id',
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

  const handleSelectAllClick = (event) => {
    if (!checkboxSelection || !onSelectionChange)
      return;

    if (event.target.checked) {
      const newSelectedOne = rows.map(row => row[rowIdField]);
      onSelectionChange(newSelectedOne);
    } else {
      onSelectionChange([]);
    }
  };

  const handleRowSelectClick = (_event, rowId) => {
    if (!checkboxSelection || !onSelectionChange)
      return;

    const selectedIndex = selectedRows.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, rowId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    onSelectionChange(newSelected);
  }

  const isSelected = (rowId) => selectedRows.indexOf(rowId) !== -1;

  const descendingComparator = (a, b, orderBy) => {
    const column = columns.find(col => col.field === orderBy);

    let aValue, bValue;

    if (column && column.sortComparator) {
      return column.sortComparator(a, b, orderBy);
    }

    if (column && column.sortValueGetter) {
      aValue = column.sortValueGetter({ row: a });
      bValue = column.sortValueGetter({ row: b });
    } else if (column && column.valueGetter) {
      aValue = column.valueGetter({ row: a });
      bValue = column.valueGetter({ row: b });
    } else {
      aValue = a[orderBy];
      bValue = b[orderBy];
    }

    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';

    const numA = Number(aValue);
    const numB = Number(bValue);
    if (!isNaN(numA) && !isNaN(numB) && aValue !== '' && bValue !== '') {
      return numB - numA;
    }

    const dateA = new Date(aValue);
    const dateB = new Date(bValue);
    if (
      !isNaN(dateA.getTime()) &&
      !isNaN(dateB.getTime()) &&
      (aValue.toString().length > 8 ||
        aValue.toString().includes('-') ||
        aValue.toString().includes('/'))
    ) {
      return dateB.getTime() - dateA.getTime();
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
                {checkboxSelection && (
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                      checked={rows.length > 0 && selectedRows.length === rows.length}
                      onChange={handleSelectAllClick}
                      inputProps={{
                        'aria-label': 'select all rows'
                      }}
                    />
                  </TableCell>
                )}
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
                  <TableRow key={index}>
                    {checkboxSelection && (
                      <TableCell padding='checkbox'>
                        <Skeleton variant='rectangular' width={20} height={20} />
                      </TableCell>
                    )}
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton variant='text' width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sortedAndPaginatedRows.length > 0 ? (
                sortedAndPaginatedRows.map((row, index) => {
                  const isItemSelected = isSelected(row[rowIdField]);
                  return (
                    <TableRow
                      key={`${row[rowIdField]}|${index}`}
                      hover
                      onClick={(event) => {
                        if (checkboxSelection) {
                          handleRowSelectClick(event, row[rowIdField]);
                        } else if (onRowClick) {
                          onRowClick(row);
                        }
                      }}
                      sx={{
                        cursor: (checkboxSelection || onRowClick) ? 'pointer' : 'default',
                        backgroundColor: isItemSelected ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                      }}
                      selected={isItemSelected}
                    >
                      {checkboxSelection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => handleRowSelectClick(event, row[rowIdField])}
                            inputProps={{
                              'aria-labelledby': `enhanced-table-checkbox-${index}`,
                            }}
                          />
                        </TableCell>
                      )}

                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          align={column.align || 'left'}
                        >
                          {renderCellContent(row, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
               ) : (
                  <TableRow>
                    <TableCell
                      colSpan={(checkboxSelection ? 1 : 0) + columns.length}
                      align="center"
                      sx={{ py: 3 }}
                    >
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
