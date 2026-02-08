import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
// Ensure this matches your filename (plural vs singular)
import { createProject } from '../redux/slices/projectSlice'; 
import { User } from '../types';

const CreateProjectScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  // This selector will now work correctly after the store.ts fix
  const allUsers = useAppSelector(state => state.directory.users);

  // Form State
  const [name, setName] = useState('');
  const [manager, setManager] = useState<User | null>(null);
  const [members, setMembers] = useState<{ user: User; role: string }[]>([]);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'manager' | 'member'>('manager');

  // --- Handlers ---

  const handleCreate = () => {
    if (!name || !manager) {
      Alert.alert('Error', 'Project Name and Manager are required.');
      return;
    }

    const newProject = {
      // Simple ID generator (Timestamp + Random Number)
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      description: '',
      manager,
      members,
      createdAt: Date.now(),
    };

    dispatch(createProject(newProject));
    navigation.goBack();
  };

  const openUserPicker = (mode: 'manager' | 'member') => {
    setSelectionMode(mode);
    setSearchQuery('');
    setModalVisible(true);
  };

  const handleUserSelect = (user: User) => {
    if (selectionMode === 'manager') {
      setManager(user);
    } else {
      // Check if already added
      if (members.some(m => m.user.id === user.id) || manager?.id === user.id) {
        Alert.alert('Already added', 'User is already in the project.');
        return;
      }
      // Add with default role
      setMembers([...members, { user, role: 'Developer' }]);
    }
    setModalVisible(false);
  };

  const updateRole = (index: number, newRole: string) => {
    const updated = [...members];
    updated[index].role = newRole;
    setMembers(updated);
  };

  // --- Render ---

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Project Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Apollo Rewrite" />

        {/* Manager Section */}
        <Text style={styles.label}>Project Manager</Text>
        <TouchableOpacity style={styles.selector} onPress={() => openUserPicker('manager')}>
          <Text style={manager ? styles.selectedText : styles.placeholderText}>
            {manager ? `👤 ${manager.firstName} ${manager.lastName}` : 'Select Manager...'}
          </Text>
        </TouchableOpacity>

        {/* Members Section */}
        <View style={styles.row}>
          <Text style={styles.label}>Team Members</Text>
          <TouchableOpacity onPress={() => openUserPicker('member')}>
            <Text style={styles.addLink}>+ Add Member</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={members}
          keyExtractor={item => item.user.id}
          renderItem={({ item, index }) => (
            <View style={styles.memberRow}>
              <Text style={styles.memberName}>{item.user.firstName} {item.user.lastName}</Text>
              <TextInput 
                style={styles.roleInput} 
                value={item.role} 
                onChangeText={(text) => updateRole(index, text)}
                placeholder="Role"
              />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No members added yet.</Text>}
        />

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create Project</Text>
        </TouchableOpacity>
      </View>

      {/* --- USER PICKER MODAL --- */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {selectionMode === 'manager' ? 'Manager' : 'Member'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <TextInput 
            style={styles.input} 
            placeholder="Search users..." 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
          <FlatList
            data={allUsers.filter(u => 
              `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                <Text style={styles.userItemText}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.userItemSub}>{item.jobTitle}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20, flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  selector: { borderWidth: 1, borderColor: '#007AFF', padding: 12, borderRadius: 8, backgroundColor: '#F0F8FF' },
  selectedText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  placeholderText: { fontSize: 16, color: '#999' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 5 },
  addLink: { color: '#007AFF', fontWeight: 'bold' },
  createBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  createBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  
  // Member List Styles
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  memberName: { flex: 1, fontSize: 16 },
  roleInput: { width: 120, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 5, fontSize: 14, textAlign: 'center' },
  emptyText: { fontStyle: 'italic', color: '#999', marginTop: 10 },

  // Modal Styles
  modalContainer: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeText: { color: 'red', fontSize: 16 },
  userItem: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  userItemText: { fontSize: 16, fontWeight: 'bold' },
  userItemSub: { color: '#666' }
});

export default CreateProjectScreen;