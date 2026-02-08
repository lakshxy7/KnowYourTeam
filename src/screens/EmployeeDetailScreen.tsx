import React, { useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Linking, 
  Platform 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToTeam, removeFromTeam } from '../redux/slices/teamSlice';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployeeDetails'>;

const EmployeeDetailScreen = ({ route, navigation }: Props) => {
  const { user } = route.params;
  const dispatch = useAppDispatch();
  
  const isSaved = useAppSelector((state) => 
    state.team.savedUsers.some((saved) => saved.id === user.id)
  );

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

  const handleEmailPress = async () => {
    const email = user.email;
    const gmailUrl = `googlegmail://co?to=${email}`;
    const mailtoUrl = `mailto:${email}`;

    try {
      const isGmailSupported = await Linking.canOpenURL(gmailUrl);

      if (isGmailSupported) {
        await Linking.openURL(gmailUrl);
      } else {
        await Linking.openURL(mailtoUrl);
      }
    } catch (err) {
      console.log('Error opening email client:', err);
      try {
        await Linking.openURL(mailtoUrl);
      } catch (e) {
        Alert.alert("Error", "No email app available on this device.");
      }
    }
  };

  const handlePhonePress = () => {
    const scheme = Platform.OS === 'ios' ? 'telprompt:' : 'tel:';
    const url = `${scheme}${user.phone}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "No phone app available");
        }
      })
      .catch((err) => console.error('An error occurred', err));
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
        <InfoRow 
          label="Email" 
          value={user.email} 
          onPress={handleEmailPress} 
          isLink 
        />
        <InfoRow 
          label="Phone" 
          value={user.phone} 
          onPress={handlePhonePress} 
          isLink 
        />
        <InfoRow 
          label="Location" 
          value={`${user.city}, ${user.country}`} 
        />
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

interface InfoRowProps {
  label: string;
  value: string;
  onPress?: () => void; 
  isLink?: boolean;    
}

const InfoRow = ({ label, value, onPress, isLink }: InfoRowProps) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isLink && styles.linkValue]}>{value}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15, backgroundColor: '#eee' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  role: { fontSize: 18, color: '#666', marginBottom: 5, textAlign: 'center' },
  dept: { fontSize: 16, color: '#007AFF', fontWeight: '600', marginBottom: 5 },
  
  infoSection: { width: '100%', marginBottom: 30 },
  
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eee',
    alignItems: 'center' 
  },
  
  label: { fontSize: 16, color: '#888' },
  
  value: { fontSize: 16, fontWeight: '500', color: '#333', maxWidth: '70%', textAlign: 'right' },
  linkValue: { color: '#007AFF', textDecorationLine: 'underline' }, 

  button: { width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonAdd: { backgroundColor: '#007AFF' },
  buttonRemove: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EmployeeDetailScreen;