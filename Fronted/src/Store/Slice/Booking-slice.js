export const createBookingSlice = (set) => ({
  booking: [], // Correctly initialized as an array

  setBooking: (BookingInfo) => set({ booking: BookingInfo }), // ✅ Fixes state key

  AddBookingData: (bookingData) =>
    set((state) => ({
      booking: [...state.booking, bookingData], // ✅ Uses the correct state key
    })),

  updateBooking: (updatedBooking) =>
    set((state) => ({
      booking: state.booking.map((booking) =>
        booking._id === updatedBooking._id
          ? {
              ...booking,
              userName: updatedBooking.userName, // ✅ Only updating necessary fields
              userPhone: updatedBooking.userPhone,
              tourDate: updatedBooking.tourDate,
            }
          : booking
      ),
    })),
    removeBooking: (bookingId) =>
      set((state) => ({
        booking: state.booking.filter((booking) => booking._id !== bookingId), // ✅ Removes object by `_id`
      })),
});