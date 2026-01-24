import { useState } from 'react'
import hotelService from '../services/hotelService'
import HotelSearchBar from './HotelManagement/HotelSearchBar'
import HotelDataGrid from './HotelManagement/HotelDataGrid'
import HotelFormDialog from './HotelManagement/HotelFormDialog'

const HotelManagement = ({
    allHotels,
    searchQuery,
    filteredHotels,
    isLoading,
    handleHotelSearch,
    clearSearch,
    onHotelUpdated
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingHotel, setEditingHotel] = useState(null)

    const handleCreate = () => {
        setEditingHotel(null)
        setDialogOpen(true)
    }

    const handleEdit = (hotel) => {
        setEditingHotel(hotel)
        setDialogOpen(true)
    }

    const handleDelete = async (hotel) => {
        if (!window.confirm(`Are you sure you want to delete "${hotel.hotelName}"?`)) {
            return
        }

        try {
            await hotelService.deleteHotel(hotel.id)
            alert('Hotel deleted successfully!')
            onHotelUpdated()
        } catch (error) {
            console.error('Error deleting hotel:', error)
            alert(`Failed to delete hotel: ${error.response?.data?.message || error.message}`)
        }
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
        setEditingHotel(null)
    }

    return (
        <>
            <HotelSearchBar
                searchQuery={searchQuery}
                filteredHotels={filteredHotels}
                allHotels={allHotels}
                handleHotelSearch={handleHotelSearch}
                clearSearch={clearSearch}
                onCreateHotel={handleCreate}
            />

            <HotelDataGrid
                filteredHotels={filteredHotels}
                isLoading={isLoading}
                onEditHotel={handleEdit}
                onDeleteHotel={handleDelete}
            />

            <HotelFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                editingHotel={editingHotel}
                onHotelUpdated={onHotelUpdated}
            />
        </>
    )
}

export default HotelManagement