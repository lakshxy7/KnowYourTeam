import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks'; 
import { fetchUsers } from '../redux/slices/directorySlice';

const DirectoryScreen = () => {
  // ✅ usage of typed hooks
  const dispatch = useAppDispatch(); 
  const { users, status } = useAppSelector((state) => state.directory);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(1)); 
    }
  }, [dispatch, status]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Directory Screen</Text>
      <Text>Users Loaded: {users.length}</Text>
    </View>
  );
};

export default DirectoryScreen;