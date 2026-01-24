import React, { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import hotelService from "../../services/hotelService";

const HotelFormDialog = ({ open, onClose, editingHotel, onHotelUpdated }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      hotelName: "",
      city: "",
      state: "",
      country: "",
      category: "",
      rating: "",
      description: "",
      amenities: [],
      phoneNo: "",
      email: "",
      website: "",
      address: "",
      coordinates: { latitude: "", longitude: "" },
      checkInTime: "",
      checkOutTime: "",
      imageUrl: "",
      gallery: [],
      roomTypes: [],
      policies: {
        cancellation: "",
        childPolicy: "",
        petPolicy: "",
        smokingPolicy: "",
      },
      nearbyAttractions: [],
    });
    setError("");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      // Basic validation
      if (!formData.hotelName || !formData.city || !formData.country) {
        setError("Hotel name, city, and country are required");
        return;
      }

      const hotelData = {
        ...formData,
        rating: parseFloat(formData.rating) || 0,
        coordinates: {
          latitude: parseFloat(formData.coordinates?.latitude) || 0,
          longitude: parseFloat(formData.coordinates?.longitude) || 0,
        },
      };

      if (editingHotel) {
        await hotelService.updateHotel(editingHotel.id, hotelData);
        alert("Hotel updated successfully!");
      } else {
        await hotelService.createHotel(hotelData);
        alert("Hotel created successfully!");
      }

      onClose();
      resetForm();
      onHotelUpdated();
    } catch (error) {
      console.error("Error saving hotel:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  // Initialize form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (editingHotel) {
        setFormData({
          ...editingHotel,
          amenities: editingHotel.amenities || [],
          gallery: editingHotel.gallery || [],
          roomTypes: editingHotel.roomTypes || [],
          policies: editingHotel.policies || {
            cancellation: "",
            childPolicy: "",
            petPolicy: "",
            smokingPolicy: "",
          },
          nearbyAttractions: editingHotel.nearbyAttractions || [],
        });
      } else {
        resetForm();
      }
    }
  }, [open, editingHotel]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingHotel ? "Edit Hotel" : "Create New Hotel"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hotel Name"
              value={formData.hotelName || ""}
              onChange={(e) => handleFormChange("hotelName", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              value={formData.category || ""}
              onChange={(e) => handleFormChange("category", e.target.value)}
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              value={formData.city || ""}
              onChange={(e) => handleFormChange("city", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              value={formData.state || ""}
              onChange={(e) => handleFormChange("state", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country || ""}
              onChange={(e) => handleFormChange("country", e.target.value)}
              required
            />
          </Grid>

          {/* Contact & Rating */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rating"
              type="number"
              value={formData.rating || ""}
              onChange={(e) => handleFormChange("rating", e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNo || ""}
              onChange={(e) => handleFormChange("phoneNo", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleFormChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={formData.website || ""}
              onChange={(e) => handleFormChange("website", e.target.value)}
            />
          </Grid>

          {/* Address & Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              value={formData.address || ""}
              onChange={(e) => handleFormChange("address", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </Grid>

          {/* Check-in/out times */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Check-in Time"
              value={formData.checkInTime || ""}
              onChange={(e) => handleFormChange("checkInTime", e.target.value)}
              placeholder="14:00"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Check-out Time"
              value={formData.checkOutTime || ""}
              onChange={(e) => handleFormChange("checkOutTime", e.target.value)}
              placeholder="12:00"
            />
          </Grid>

          {/* Coordinates */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.coordinates?.latitude || ""}
              onChange={(e) =>
                handleNestedChange("coordinates", "latitude", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.coordinates?.longitude || ""}
              onChange={(e) =>
                handleNestedChange("coordinates", "longitude", e.target.value)
              }
            />
          </Grid>

          {/* Image URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl || ""}
              onChange={(e) => handleFormChange("imageUrl", e.target.value)}
              placeholder="e.g., hotel-main.jpg"
            />
          </Grid>

          {/* Gallery */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gallery Images (comma-separated URLs)"
              value={formData.gallery?.join(", ") || ""}
              onChange={(e) =>
                handleFormChange(
                  "gallery",
                  e.target.value.split(",").map((url) => url.trim()),
                )
              }
              placeholder="image1.jpg, image2.jpg"
            />
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amenities (comma-separated)"
              value={formData.amenities?.join(", ") || ""}
              onChange={(e) =>
                handleFormChange(
                  "amenities",
                  e.target.value.split(",").map((item) => item.trim()),
                )
              }
              placeholder="Free WiFi, Swimming Pool, Fitness Center"
            />
          </Grid>

          {/* Policies */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Policies
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cancellation Policy"
              multiline
              rows={2}
              value={formData.policies?.cancellation || ""}
              onChange={(e) =>
                handleNestedChange("policies", "cancellation", e.target.value)
              }
              placeholder="Free cancellation up to 24 hours"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Child Policy"
              multiline
              rows={2}
              value={formData.policies?.childPolicy || ""}
              onChange={(e) =>
                handleNestedChange("policies", "childPolicy", e.target.value)
              }
              placeholder="Children under 12 stay free"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pet Policy"
              multiline
              rows={2}
              value={formData.policies?.petPolicy || ""}
              onChange={(e) =>
                handleNestedChange("policies", "petPolicy", e.target.value)
              }
              placeholder="Pets not allowed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Smoking Policy"
              multiline
              rows={2}
              value={formData.policies?.smokingPolicy || ""}
              onChange={(e) =>
                handleNestedChange("policies", "smokingPolicy", e.target.value)
              }
              placeholder="Non-smoking property"
            />
          </Grid>

          {/* Nearby Attractions */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Nearby Attractions (JSON format)
            </Typography>
            <TextField
              fullWidth
              label="Nearby Attractions"
              multiline
              rows={3}
              value={JSON.stringify(formData.nearbyAttractions || [], null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleFormChange("nearbyAttractions", parsed);
                } catch (err) {
                  // Invalid JSON, keep as string for now
                }
              }}
              placeholder='[{"name": "Red Fort", "distance": "5 km"}]'
            />
          </Grid>

          {/* Room Types */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Room Types (JSON format)
            </Typography>
            <TextField
              fullWidth
              label="Room Types"
              multiline
              rows={5}
              value={JSON.stringify(formData.roomTypes || [], null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleFormChange("roomTypes", parsed);
                } catch (err) {
                  // Invalid JSON, keep as string for now
                }
              }}
              placeholder='[{"id": "standard", "name": "Standard Room", "pricePerNight": 3500, ...}]'
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "Saving..." : editingHotel ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HotelFormDialog;
