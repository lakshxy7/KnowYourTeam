import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import { RootStackParamList } from '../navigation/AppNavigator';

const ProjectsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const projects = useAppSelector(state => state.projects.list);

  return (
    <View style={styles.container}>
      {/* Create Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateProject')}
      >
        <Text style={styles.fabText}>+ New Project</Text>
      </TouchableOpacity>

      {projects.length === 0 ? (
        <View style={styles.empty}>
          <Text>No active projects.</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ProjectDetails', { project: item })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.manager}>Manager: {item.manager.firstName} {item.manager.lastName}</Text>
              <Text style={styles.count}>{item.members.length} Members</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  manager: { fontSize: 14, color: '#666', marginTop: 5 },
  count: { fontSize: 12, color: '#007AFF', marginTop: 10, fontWeight: '600' },
  fab: { 
    backgroundColor: '#007AFF', padding: 15, borderRadius: 30, 
    alignItems: 'center', marginBottom: 20 
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ProjectsScreen;