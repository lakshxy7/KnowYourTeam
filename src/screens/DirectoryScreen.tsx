import React, { useEffect, useCallback, useState } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Text,
  RefreshControl,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Custom Imports
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUsers, resetDirectory } from '../redux/slices/directorySlice';
import UserListItem from '../components/UserListItem';
import { RootStackParamList } from '../navigation/AppNavigator';
import { User } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmployeeDetails'>;

const DirectoryScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  
  // Select state from Redux
  const { users, page, status, error } = useAppSelector((state) => state.directory);

  // Local State for Search
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial Load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(1));
    }
  }, [status, dispatch]);

  // 2. Filter Logic (Client-Side Search)
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    // Search by Name or Department
    return fullName.includes(query) || user.department.toLowerCase().includes(query);
  });

  // 3. Load More Handler (Infinite Scroll)
  const handleLoadMore = () => {
    // Only fetch more if NOT loading AND NOT searching
    // (We disable infinite scroll during search to avoid confusing behavior)
    if (status !== 'loading' && searchQuery.length === 0) {
      dispatch(fetchUsers(page));
    }
  };

  // 4. Refresh Handler (Pull-to-Refresh)
  const handleRefresh = useCallback(() => {
    setSearchQuery(''); // Clear search on refresh
    dispatch(resetDirectory()); 
    dispatch(fetchUsers(1));   
  }, [dispatch]);

  // 5. Navigation Handler
  const handleUserPress = (user: User) => {
    navigation.navigate('EmployeeDetails', { user: user });
  };

  // 6. Footer Loader
  const renderFooter = () => {
    if (status === 'loading' && users.length > 0 && searchQuery.length === 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    return null;
  };

  // 7. Empty Search State
  const renderEmptyComponent = () => {
    if (searchQuery.length > 0 && filteredUsers.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No matches found for "{searchQuery}"</Text>
        </View>
      );
    }
    return null;
  };

  // Loading State (Initial)
  if (status === 'loading' && users.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Error State
  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or department..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing" // iOS standard clear button
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filteredUsers} // Use the filtered list
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={handleUserPress} />
        )}
        
        // Infinite Scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        
        // Components
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        
        refreshControl={
          <RefreshControl 
            refreshing={status === 'loading' && page === 1} 
            onRefresh={handleRefresh} 
          />
        }
        
        // Optimization
        initialNumToRender={10}
        windowSize={5}
        // Fix for keyboard covering list
        keyboardShouldPersistTaps="handled" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  footer: { padding: 20, alignItems: 'center' },
  retryText: { color: 'blue', marginTop: 10, fontSize: 16 },
  emptyText: { color: '#666', fontSize: 16 },
  
  // Search Styles
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default DirectoryScreen;