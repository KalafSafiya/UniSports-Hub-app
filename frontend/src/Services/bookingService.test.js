import api from './api';
import { getAllApprovedBookings } from './bookingService';
jest.mock('./api', () => ({ get: jest.fn() }));
test('approved bookings use the bookings API endpoint', async () => {
    api.get.mockResolvedValue({ data: [{ booking_id: 1 }] });
    expect(await getAllApprovedBookings()).toEqual([{ booking_id: 1 }]);
    expect(api.get).toHaveBeenCalledWith('/bookings/approved', expect.any(Object));
});
