import { useState, useEffect } from 'react';
import useSWR from 'swr'; // Importing the SWR library for data fetching
import axios from 'axios'; // Importing Axios for making HTTP requests
import { getApiUrl } from '../config/apiConfig'; // Importing a utility to get the base API URL


// Default fetcher function for SWR.
// This function is responsible for making the actual data request.
const fetcher = (url) => axios.get(url).then(res => res.data);

// Default SWR configuration options.
// These options control SWR's behavior like revalidation, caching, and error handling.
const defaultSWRConfig = {
    refreshInterval: 0, // No automatic revalidation on a timer by default
    revalidateOnFocus: false, // Do not revalidate when window/tab regains focus by default
    revalidateOnReconnect: false, // Do not revalidate when network connection is re-established by default
    shouldRetryOnError: false, // Do not retry fetching on error by default
    dedupingInterval: 2000, // Dedupe requests within 2 seconds to avoid duplicate fetches
    errorRetryCount: 3, // Retry failed requests up to 3 times
    errorRetryInterval: 5000, // Wait 5 seconds before retrying on error
};

/**
 * Generic SWR hook for data fetching.
 * This is the foundational hook that other specific hooks will build upon.
 * It provides core SWR functionalities like data, error, loading state, and mutation.
 * @param {string|null} endpoint - API endpoint (e.g., '/users', '/bookings'). If null, no fetch will occur.
 * @param {object} options - SWR configuration options to override or extend `defaultSWRConfig`.
 * @returns {object} - An object containing:
 * - `data`: The fetched data.
 * - `error`: Error object if fetching failed.
 * - `isLoading`: Boolean indicating if data is currently being loaded (initial fetch).
 * - `mutate`: Function to manually revalidate or update the cached data.
 * - `isError`: Boolean indicating if an error occurred during fetching.
 * - `isValidating`: Boolean indicating if data is currently being revalidated (refreshed).
 * - `refresh`: Convenience function to trigger a revalidation.
 */
export const useSWRData = (endpoint, options = {}) => {
    // Merge default SWR configuration with any provided options.
    const config = { ...defaultSWRConfig, ...options };
    // Construct the full URL using the base API URL and the provided endpoint.
    // If endpoint is null, url will also be null, preventing the fetch.
    const url = endpoint ? getApiUrl(endpoint) : null;

    // Call the core useSWR hook with the constructed URL, fetcher, and configuration.
    const { data, error, isLoading, mutate, isValidating } = useSWR(url, fetcher, config);

    return {
        data,
        error,
        isLoading,
        mutate,
        isError: !!error, // Convert error object to a boolean flag
        isValidating,
        refresh: () => mutate(), // Provide a simpler `refresh` function
    };
};

/**
 * Hook for fetching data with conditional enabling.
 * The request will only be made if the `enabled` flag is true.
 * Useful for fetching data only when certain conditions are met (e.g., user is logged in).
 * @param {string} endpoint - API endpoint.
 * @param {boolean} enabled - Whether to enable the data request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`.
 */
export const useConditionalSWR = (endpoint, enabled = true, options = {}) => {
    // If not enabled, pass null as the endpoint to useSWRData to prevent fetching.
    return useSWRData(enabled ? endpoint : null, options);
};

/**
 * Hook for fetching data with dependencies.
 * The request will only be made if all provided dependencies are truthy (not null, undefined, or empty string).
 * This is useful for hooks that depend on dynamic IDs or parameters.
 * @param {string} endpoint - API endpoint.
 * @param {array} dependencies - Array of values that must be truthy for the request to be enabled.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`.
 */
export const useDependentSWR = (endpoint, dependencies = [], options = {}) => {
    // Check if all dependencies are truthy.
    const enabled = dependencies.every(dep => dep !== null && dep !== undefined && dep !== '');
    // Conditionally enable the fetch based on dependencies.
    return useSWRData(enabled ? endpoint : null, options);
};

/**
 * Hook for fetching paginated data.
 * Automatically appends `_page` and `_limit` query parameters to the endpoint.
 * @param {string} endpoint - Base API endpoint (e.g., '/items').
 * @param {number} page - Current page number (1-indexed). Defaults to `1`.
 * @param {number} limit - Number of items per page. Defaults to `10`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`.
 */
export const usePaginatedSWR = (endpoint, page = 1, limit = 10, options = {}) => {
    // Construct the endpoint with pagination query parameters.
    const paginatedEndpoint = `${endpoint}?_page=${page}&_limit=${limit}`;
    return useSWRData(paginatedEndpoint, options);
};

/**
 * Hook for fetching filtered data.
 * Converts a filters object into URL query parameters.
 * @param {string} endpoint - Base API endpoint (e.g., '/products').
 * @param {object} filters - An object where keys are filter names and values are filter values.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`.
 */
export const useFilteredSWR = (endpoint, filters = {}, options = {}) => {
    // Convert filters object to URL search parameters string.
    const queryParams = new URLSearchParams(filters).toString();
    // Append query parameters to the endpoint if they exist.
    const filteredEndpoint = queryParams ? `${endpoint}?${queryParams}` : endpoint;
    return useSWRData(filteredEndpoint, options);
};

// ==============================================
// SPECIFIC HOOKS FOR COMMON DATA PATTERNS
// These hooks are built on top of the generic SWR hooks for convenience.
// ==============================================

/**
 * Hook for fetching all users.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: User[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useUsers = (enabled = true, options = {}) => {
    return useConditionalSWR('/users', enabled, options);
};

/**
 * Hook for fetching a specific user by ID.
 * The request is dependent on `userId` being truthy.
 * @param {string} userId - The ID of the user to fetch.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: User, error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useUser = (userId, enabled = true, options = {}) => {
    return useDependentSWR(`/users/${userId}`, [userId], {
        ...options,
        revalidateOnMount: enabled, // Revalidate on mount if enabled
    });
};

/**
 * Hook for fetching a user by email.
 * This hook first fetches all users and then filters them by email client-side.
 * It will only fetch if `email` is provided and includes '@'.
 * @param {string} email - The email of the user to find.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: User|null, error, isLoading, mutate, isError, refresh }.
 */
export const useUserByEmail = (email, enabled = true, options = {}) => {
    // Determine if fetching should occur based on `enabled` and `email` format.
    const shouldFetch = enabled && email && email.includes('@');
    // Fetch all users conditionally.
    const { data: allUsers, error, isLoading, mutate } = useUsers(shouldFetch, options);

    // Filter the fetched users client-side to find the one matching the email.
    const userData = allUsers?.find(user => user.email === email);

    return {
        data: userData || null, // Return the found user or null
        error,
        isLoading,
        mutate,
        isError: !!error,
        refresh: () => mutate(), // Provide refresh for the underlying `useUsers` fetch
    };
};

/**
 * Hook for fetching all bookings.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Booking[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useBookings = (enabled = true, options = {}) => {
    return useConditionalSWR('/bookings', enabled, options);
};

/**
 * Hook for fetching bookings by a specific user ID.
 * This hook fetches all bookings and then filters them by `userId` client-side.
 * @param {string} userId - The ID of the user whose bookings to fetch.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Booking[], error, isLoading, mutate, isError, refresh }.
 */
export const useUserBookings = (userId, enabled = true, options = {}) => {
    // Fetch all bookings conditionally.
    const { data: allBookings, error, isLoading, mutate } = useBookings(enabled, options);

    // Filter the fetched bookings client-side by user ID.
    const userBookings = allBookings?.filter(booking =>
        booking.userId && String(booking.userId) === String(userId) // Ensure type-safe comparison
    );

    return {
        data: userBookings || [], // Return filtered bookings or an empty array
        error,
        isLoading,
        mutate,
        isError: !!error,
        refresh: () => mutate(), // Provide refresh for the underlying `useBookings` fetch
    };
};

/**
 * Hook for fetching a specific booking by ID.
 * @param {string} bookingId - The ID of the booking to fetch.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Booking, error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useBooking = (bookingId, enabled = true, options = {}) => {
    return useDependentSWR(`/bookings/${bookingId}`, [bookingId], options);
};

/**
 * Hook for fetching all hotels.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Hotel[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useHotels = (enabled = true, options = {}) => {
    return useConditionalSWR('/hotels', enabled, options);
};

/**
 * Hook for fetching a specific hotel by ID.
 * @param {string} hotelId - The ID of the hotel to fetch.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Hotel, error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useHotel = (hotelId, enabled = true, options = {}) => {
    return useDependentSWR(`/hotels/${hotelId}`, [hotelId], options);
};

/**
 * Hook for fetching reviews for a specific hotel.
 * Appends `hotelId` as a query parameter.
 * @param {string} hotelId - The ID of the hotel whose reviews to fetch.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: Review[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useHotelReviews = (hotelId, enabled = true, options = {}) => {
    return useDependentSWR(`/reviews?hotelId=${hotelId}`, [hotelId], options);
};

/**
 * Hook for fetching admin code requests.
 * Includes a default `refreshInterval` for frequent updates.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: AdminCodeRequest[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useAdminCodeRequests = (enabled = true, options = {}) => {
    return useConditionalSWR('/admin-code-requests', enabled, {
        ...options,
        refreshInterval: 30000, // Refresh every 30 seconds for admin requests
    });
};

/**
 * Hook for fetching admin codes.
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - { data: AdminCode[], error, isLoading, mutate, isError, isValidating, refresh }.
 */
export const useAdminCodes = (enabled = true, options = {}) => {
    return useConditionalSWR('/admin-codes', enabled, options);
};

/**
 * Hook for real-time data with auto-refresh.
 * Sets `refreshInterval`, `revalidateOnFocus`, and `revalidateOnReconnect` to true by default.
 * @param {string} endpoint - API endpoint.
 * @param {number} refreshInterval - Refresh interval in milliseconds. Defaults to `5000` (5 seconds).
 * @param {boolean} enabled - Whether to enable the request. Defaults to `true`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`.
 */
export const useRealTimeSWR = (endpoint, refreshInterval = 5000, enabled = true, options = {}) => {
    return useSWRData(enabled ? endpoint : null, {
        ...options,
        refreshInterval, // Override default refresh interval
        revalidateOnFocus: true, // Revalidate when window/tab regains focus
        revalidateOnReconnect: true, // Revalidate when network connection is re-established
    });
};

/**
 * Hook for fetching multiple endpoints in parallel using individual `useSWR` calls.
 * This is suitable when you have a fixed, small number of endpoints.
 * @param {array<string>} endpoints - Array of API endpoints to fetch (e.g., ['/users', '/hotels']).
 * @param {boolean} enabled - Whether to enable all requests. Defaults to `true`.
 * @param {object} options - SWR configuration options applied to all individual fetches.
 * @returns {object} - An object containing:
 * - `results`: An array of individual SWR results for each endpoint.
 * - `data`: An array of fetched data, corresponding to the order of `endpoints`.
 * - `isLoading`: Boolean, true if any of the requests are loading.
 * - `isError`: Boolean, true if any of the requests resulted in an error.
 * - `errors`: An array of error objects from failed requests.
 * - `refresh`: Function to trigger revalidation for all endpoints.
 */
export const useMultipleSWR = (endpoints, enabled = true, options = {}) => {
    // Create SWR keys for all endpoints. If not enabled, the key will be null, preventing fetch.
    const swrKeys = endpoints.map(endpoint => enabled ? endpoint : null);

    // Use multiple useSWR hooks - this is acceptable for a fixed number of endpoints.
    // Each endpoint gets its own SWR instance.
    /* eslint-disable react-hooks/rules-of-hooks */
    const results = swrKeys.map(key => {
        const { data, error, isLoading, mutate } = useSWR(key, key ? fetcher : null, {
            ...defaultSWRConfig,
            ...options,
        });

        return {
            data,
            error,
            isLoading,
            isError: !!error,
            mutate,
        };
    });
    /* eslint-enable react-hooks/rules-of-hooks */


    // Aggregate loading and error states from all individual results.
    const isLoading = results.some(result => result.isLoading);
    const isError = results.some(result => result.isError);
    const errors = results.filter(result => result.error).map(result => result.error);

    return {
        results, // Individual SWR results for more granular control
        data: results.map(result => result.data), // Array of data from all fetches
        isLoading,
        isError,
        errors,
        refresh: () => results.forEach(result => result.mutate()), // Refresh all individual fetches
    };
};

/**
 * Hook for search functionality with debouncing.
 * It delays the API request until the user stops typing for a specified duration.
 * @param {string} endpoint - Base API endpoint for search (e.g., '/items').
 * @param {string} searchTerm - The current search term. Defaults to an empty string.
 * @param {number} debounceMs - Debounce delay in milliseconds. Defaults to `300`.
 * @param {object} options - SWR configuration options.
 * @returns {object} - Same return object as `useSWRData`, but the fetch is debounced.
 */
export const useSearchSWR = (endpoint, searchTerm = '', debounceMs = 300, options = {}) => {
    // State to hold the debounced search term.
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    // useEffect to manage the debounce timer.
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Update debounced term after delay
        }, debounceMs);

        // Cleanup function: Clear the timeout if searchTerm or debounceMs changes before the timer fires.
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, debounceMs]); // Dependencies: searchTerm and debounceMs

    // Construct the search endpoint with the debounced search term.
    // `q` is a common query parameter for full-text search.
    const searchEndpoint = debouncedSearchTerm ?
        `${endpoint}?q=${encodeURIComponent(debouncedSearchTerm)}` :
        endpoint;

    // Use useSWRData with the debounced endpoint.
    // The fetch is only enabled if there's a debounced search term.
    return useSWRData(debouncedSearchTerm ? searchEndpoint : null, options);
};

export default useSWRData;
