import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Redux
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToTeam, removeFromTeam } from '../redux/slices/teamSlice';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeDetails'>;

const EmployeeDetailScreen = ({ route, navigation }: Props) => {
  const { user } = route.params;
  const dispatch = useAppDispatch();
  
  // Check if user is already saved
  const isSaved = useAppSelector((state) => 
    state.team.savedUsers.some((saved) => saved.id === user.id)
  );

  // Set Header Title dynamically
  useLayoutEffect(() => {
    navigation.setOptions({ title: `${user.firstName} ${user.lastName}` });
  }, [navigation, user]);

  const handleToggleTeam = () => {
    if (isSaved) {
      dispatch(removeFromTeam(user.id));
      Alert.alert('Removed', `${user.firstName} has been removed from your team.`);
    } else {
      dispatch(addToTeam(user));
      Alert.alert('Success', `${user.firstName} is now in your team!`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatarLarge }} style={styles.avatar} />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.role}>{user.jobTitle}</Text>
        <Text style={styles.dept}>{user.department}</Text>
      </View>

      <View style={styles.infoSection}>
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Location" value={`${user.city}, ${user.country}`} />
      </View>

      <TouchableOpacity 
        style={[styles.button, isSaved ? styles.buttonRemove : styles.buttonAdd]} 
        onPress={handleToggleTeam}
      >
        <Text style={styles.buttonText}>
          {isSaved ? 'Remove from My Team' : 'Add to My Team'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Helper Component for rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  role: { fontSize: 18, color: '#666', marginBottom: 5 },
  dept: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  infoSection: { width: '100%', marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, color: '#888' },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonAdd: { backgroundColor: '#007AFF' },
  buttonRemove: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EmployeeDetailScreen;