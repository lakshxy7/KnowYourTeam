import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Text,
  RefreshControl 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Custom Imports
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUsers, resetDirectory } from '../redux/slices/directorySlice';
import UserListItem from '../components/UserListItem';
import { RootStackParamList } from '../navigation/AppNavigator';

// Define Navigation Prop Type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmployeeDetails'>;

const DirectoryScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  
  // Select data from Redux
  const { users, page, status, error } = useAppSelector((state) => state.directory);

  // Initial Load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(1));
    }
  }, [status, dispatch]);

  // Handler: Load Next Page
  const handleLoadMore = () => {
    if (status !== 'loading') {
      dispatch(fetchUsers(page));
    }
  };

  // Handler: Pull to Refresh
  const handleRefresh = useCallback(() => {
    dispatch(resetDirectory()); // Clear list
    dispatch(fetchUsers(1));    // Fetch fresh batch
  }, [dispatch]);

  // Handler: Navigate to Details
  const handleUserPress = (user: any) => {
    // We pass the User ID (or the whole object if you prefer) to the next screen
    navigation.navigate('EmployeeDetails', { userId: user.id });
  };

  // Render Footer (Loader)
  const renderFooter = () => {
    if (status === 'loading' && users.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return null;
  };

  if (status === 'loading' && users.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
        <Text style={{ color: 'blue', marginTop: 10 }} onPress={handleRefresh}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={handleUserPress} />
        )}

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        
  
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={status === 'loading' && page === 1} onRefresh={handleRefresh} />
        }
        
   
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footer: { padding: 20, alignItems: 'center' },
});

export default DirectoryScreen;