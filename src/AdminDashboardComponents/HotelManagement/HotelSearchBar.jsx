import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const HotelSearchBar = ({
  searchQuery,
  filteredHotels,
  allHotels,
  handleHotelSearch,
  clearSearch,
  onCreateHotel,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateHotel}
        >
          Create Hotel
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Autocomplete
          freeSolo
          fullWidth
          value={searchQuery}
          options={[]}
          onInputChange={(_event, value) => handleHotelSearch(null, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search hotels by name, city, or ID"
              variant="outlined"
              placeholder="Start typing to search hotels..."
              fullWidth
            />
          )}
        />
        {searchQuery && (
          <IconButton
            onClick={clearSearch}
            color="primary"
            title="Clear Search"
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>
      <Typography>
        Showing {filteredHotels.length} of {allHotels.length} hotels
        {searchQuery && ` (filtered By: "${searchQuery}")`}
      </Typography>
    </Box>
  );
};

export default HotelSearchBar;
