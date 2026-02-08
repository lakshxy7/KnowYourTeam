import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ProjectDetails'>;

const ProjectDetailsScreen = ({ route, navigation }: Props) => {
  const { project } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: project.name });
  }, [navigation, project]);

  const handleMailTeam = () => {
    // Collect all emails
    const emails = [project.manager.email, ...project.members.map(m => m.user.email)];
    const uniqueEmails = [...new Set(emails)]; // Remove duplicates
    
    // Construct Mailto Link
    // Note: 'bcc' is often better for privacy, but 'to' works for teams.
    const url = `mailto:${uniqueEmails.join(',')}?subject=[${project.name}] Update`;

    Linking.openURL(url).catch(() => 
      Alert.alert('Error', 'Could not open email client')
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Project Manager</Text>
        <View style={styles.userRow}>
          <Image source={{ uri: project.manager.avatarThumb }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{project.manager.firstName} {project.manager.lastName}</Text>
            <Text style={styles.userRole}>Manager (Lead)</Text>
          </View>
        </View>
      </View>

      {/* Team List */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Team Members ({project.members.length})</Text>
        {project.members.map((member, index) => (
          <View key={index} style={styles.userRow}>
            <Image source={{ uri: member.user.avatarThumb }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{member.user.firstName} {member.user.lastName}</Text>
              <Text style={styles.userRole}>{member.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.mailButton} onPress={handleMailTeam}>
        <Text style={styles.mailButtonText}>✉️ Mail Whole Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 14, color: '#888', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15, backgroundColor: '#ddd' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userRole: { fontSize: 14, color: '#007AFF', fontWeight: '500' },
  
  mailButton: { backgroundColor: '#34C759', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  mailButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default ProjectDetailsScreen;