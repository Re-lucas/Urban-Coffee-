import { Alert, AlertIcon, Button } from '@chakra-ui/react';

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isAdmin) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" textAlign="center" p={10}>
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          权限不足
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          您需要管理员权限才能访问此页面
        </AlertDescription>
        <Button as="a" href="/" mt={4} colorScheme="red">
          返回首页
        </Button>
      </Alert>
    );
  }

  return children;
};