import React, { useEffect, useCallback, useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  Text,
  RefreshControl,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo'; 

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchUsers, resetDirectory } from '../redux/slices/directorySlice';
import UserListItem from '../components/UserListItem';
import { DirectoryStackParamList } from '../navigation/AppNavigator'; // Updated import if needed, or keep RootStackParamList
import { User } from '../types';

// Updated to use the new nested stack param list
type NavigationProp = NativeStackNavigationProp<DirectoryStackParamList, 'DirectoryMain'>;

const DirectoryScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const netInfo = useNetInfo(); 
  
  // 1. Create a Ref for the list
  const ref = useRef<FlatList>(null);

  // 2. Hook to scroll to top when tab is tapped
  useScrollToTop(ref);

  const { users, page, status, error } = useAppSelector((state) => state.directory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers(1));
    }
  }, [status, dispatch]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || user.department.toLowerCase().includes(query);
  });

  const handleLoadMore = () => {
    if (status !== 'loading' && searchQuery.length === 0) {
      if (netInfo.isConnected === false) return; 
      dispatch(fetchUsers(page));
    }
  };

  const handleRefresh = useCallback(() => {
    if (netInfo.isConnected === false) {
      Alert.alert("No Connection", "You are offline. Showing cached data.");
      return; 
    }

    setSearchQuery('');
    dispatch(resetDirectory()); 
    dispatch(fetchUsers(1));   
  }, [dispatch, netInfo.isConnected]);

  const handleUserPress = (user: User) => {
    navigation.navigate('EmployeeDetails', { user: user });
  };

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

  const OfflineBanner = () => {
    if (netInfo.isConnected === false) {
      return (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline. Showing cached data.</Text>
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

  if (status === 'failed' && users.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Network Error</Text>
        <Text>Please check your connection.</Text>
        <Text style={styles.retryText} onPress={handleRefresh}>
          Tap to Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or department..."
          placeholderTextColor="#666" 
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
      </View>

      <FlatList
        ref={ref} // 3. Attach the Ref
        data={filteredUsers}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={handleUserPress} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl 
            refreshing={status === 'loading' && page === 1} 
            onRefresh={handleRefresh} 
            tintColor="#007AFF"
          />
        }
        initialNumToRender={10}
        windowSize={5}
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
    color: '#000', 
  },

  offlineBanner: {
    backgroundColor: '#FF3B30', 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DirectoryScreen;