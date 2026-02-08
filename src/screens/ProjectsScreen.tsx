import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';

const ProjectsScreen = () => {
  // 🔴 FIX: Cast to 'any' to bypass nesting restrictions and force access to Root Stack
  const navigation = useNavigation<any>();
  const projects = useAppSelector(state => state.projects.list);

  return (
    <View style={styles.container}>
      {/* Create Button */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.7} // Visual feedback
        onPress={() => {
            // Explicitly navigating to the Global Modal
            navigation.navigate('CreateProject'); 
        }}
      >
        <Text style={styles.fabText}>+ New Project</Text>
      </TouchableOpacity>

      {projects.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No active projects.</Text>
          <Text style={styles.subText}>Tap "+ New Project" to start one.</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ProjectDetails', { project: item })}
            >
              <View style={styles.headerRow}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.badge}>Active</Text>
              </View>
              
              <Text style={styles.manager}>
                👤 Manager: {item.manager.firstName} {item.manager.lastName}
              </Text>
              
              <View style={styles.footer}>
                <Text style={styles.count}>👥 {item.members.length} Members</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  
  // Empty State
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 14, color: '#999', marginTop: 5 },

  // Card Styles
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 12, 
    marginBottom: 15, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  badge: { backgroundColor: '#E3F2FD', color: '#007AFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  
  manager: { fontSize: 14, color: '#666', marginBottom: 12 },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
  count: { fontSize: 13, color: '#007AFF', fontWeight: '600' },
  arrow: { fontSize: 18, color: '#ccc', fontWeight: 'bold' },

  // FAB (Button)
  fab: { 
    backgroundColor: '#007AFF', 
    paddingVertical: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6
  },
  fabText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ProjectsScreen;