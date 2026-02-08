import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Redux
import { useAppSelector } from '../redux/hooks';
import { RootStackParamList } from '../navigation/AppNavigator';
import UserListItem from '../components/UserListItem';
import { User } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmployeeDetails'>;

const MyTeamScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const savedUsers = useAppSelector((state) => state.team.savedUsers);

  const handleUserPress = (user: User) => {
    navigation.navigate('EmployeeDetails', { user });
  };

  return (
    <View style={styles.container}>
      {savedUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No team members yet.</Text>
          <Text style={styles.subText}>Go to Directory and add some!</Text>
        </View>
      ) : (
        <FlatList
          data={savedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem user={item} onPress={handleUserPress} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 16, color: '#666', marginTop: 8 },
});

export default MyTeamScreen;