import axios from 'axios';
import { getApiUrl } from '../config/apiConfig';

export const useAccountLockout = () => {
    const updateUserFailedAttempts = async (userId, attempts, isLocked = false, lockoutTime = null) => {
        try {
            const response = await axios.get(getApiUrl(`/users/${userId}`));
            const userToUpdate = response.data;

            const updatedUser = {
                ...userToUpdate,
                failedLoginAttempts: attempts,
                isLocked: isLocked,
                lockoutTime: lockoutTime
            };

            await axios.put(getApiUrl(`/users/${userId}`), updatedUser);
        } catch (error) {
            console.error('Error updating user failed attempts:', error);
        }
    };

    const createIncidentTicket = async (user) => {
        try {
            const incidentId = `INC-${Date.now()}`;
            const incident = {
                id: incidentId,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                type: 'account_unlock',
                status: 'pending',
                description: 'Account locked due to multiple failed login attempts',
                failedAttempts: 3,
                lockoutTime: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                resolvedBy: null,
                resolvedAt: null,
                adminNotes: ''
            };

            await axios.post(getApiUrl('/incidentTickets'), incident);
            return incidentId;
        } catch (error) {
            console.error('Error creating incident ticket:', error);
            return null;
        }
    };

    const checkExistingTickets = async (userId) => {
        try {
            const response = await axios.get(getApiUrl('/incidentTickets'));
            const userTickets = response.data.filter(ticket =>
                ticket.userId === userId &&
                ticket.type === 'account_unlock'
            );
            return userTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        } catch (error) {
            console.error('Error fetching ticket status:', error);
            return null;
        }
    };

    return {
        updateUserFailedAttempts,
        createIncidentTicket,
        checkExistingTickets
    };
};
