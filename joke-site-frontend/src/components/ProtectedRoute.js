import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ element }) => {
    const { user, fetchUserData } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
            setLoading(false);
        };

        fetchData();
    }, [fetchUserData]);

    if (loading) {
        return <LoadingSpinner/>
    }

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
