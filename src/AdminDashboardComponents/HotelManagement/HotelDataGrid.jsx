import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../CommonComponents/CustomDataGrid";
import ExcelExport from "../../CommonComponents/ExcelExport";

const HotelDataGrid = ({
  filteredHotels,
  isLoading,
  onEditHotel,
  onDeleteHotel,
}) => {
  const hotelExportHeaders = [
    { key: "id", label: "Hotel ID" },
    { key: "hotelName", label: "Hotel Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "category", label: "Category" },
    { key: "rating", label: "Rating" },
    { key: "phoneNo", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
  ];

  const hotelManagementHeaders = [
    {
      field: "id",
      headerName: "Hotel ID",
      width: 120,
      sortable: true,
    },
    {
      field: "hotelName",
      headerName: "Hotel Name",
      width: 200,
      sortable: true,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      sortable: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      sortable: true,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      sortable: true,
      renderCell: ({ row }) => (
        <Chip label={row.rating || "N/A"} color="primary" size="small" />
      ),
    },
    {
      field: "phoneNo",
      headerName: "Phone",
      width: 150,
      sortable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => onEditHotel(row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteHotel(row)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <CustomDataGrid
      rows={filteredHotels}
      columns={hotelManagementHeaders}
      pageSize={5}
      pageSizeOptions={[5, 10, 25]}
      loading={isLoading}
      title="Hotel Management"
      subtitle="Manage all hotels in the system"
      actions={
        <ExcelExport
          data={filteredHotels}
          headers={hotelExportHeaders}
          filename="Hotels_Export"
          sheetName="Hotels"
          buttonText="Export to Excel"
        />
      }
    />
  );
};

export default HotelDataGrid;
