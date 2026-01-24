export const createBookingData = (hotel, selectedRoomType, startDate, endDate, noOfPersons, noOfRooms, typeOfRoom) => {
  const userId = sessionStorage.getItem('id');
  const checkInDate = new Date(startDate);
  const checkOutDate = new Date(endDate);
  const timeDiffMs = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.max(1, Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24)));
  const roomCost = selectedRoomType ? selectedRoomType.pricePerNight * nights * noOfRooms : 0;
  const taxes = Math.round(roomCost * 0.18);
  const totalAmount = roomCost + taxes;

  const generateBookingId = () => {
    const randomDigits = Math.random().toString().slice(2, 10);
    return `BK${randomDigits}`;
  };

  const generateBookingReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0');
    const random = Math.random().toString().slice(2, 4);
    return `BNS${year}${month}${day}${time}${random}`;
  };

  return {
    id: generateBookingId(),
    bookingReference: generateBookingReference(),
    userId: userId,
    userName: sessionStorage.getItem('name') || 'Guest',
    userEmail: sessionStorage.getItem('email') || '',
    userPhone: sessionStorage.getItem('phoneNo') || '',
    hotelId: hotel?._id,
    hotelName: hotel?.hotelName,
    roomTypeId: selectedRoomType?.id,
    roomTypeName: selectedRoomType?.name || typeOfRoom,
    checkIn: new Date(startDate).toISOString().split('T')[0],
    checkOut: new Date(endDate).toISOString().split('T')[0],
    nights: nights,
    guests: noOfPersons,
    adults: noOfPersons,
    children: 0,
    rooms: noOfRooms,
    pricePerNight: selectedRoomType?.pricePerNight || 0,
    totalRoomCost: roomCost,
    taxes: taxes,
    totalAmount: totalAmount,
    paymentStatus: 'pending',
    bookingStatus: 'confirmed',
    bookingDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    specialRequests: '',
    cancellationPolicy: hotel?.policies?.cancellation || 'Free cancellation up to 24 hours before check-in',
    createdBy: 'user',
    paymentMethod: '',
    confirmationSent: false,
    reminderSent: false,
    startDate,
    endDate,
    noOfPersons,
    noOfRooms,
    typeOfRoom,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
};