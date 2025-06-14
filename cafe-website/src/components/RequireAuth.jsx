import { Box, Spinner, Text, Button } from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box textAlign="center" p={10}>
        <Spinner size="xl" thickness="4px" />
        <Text mt={4}>验证用户权限中...</Text>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};