import React, { useState, useMemo } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, SafeAreaView, ScrollView, FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createProject } from '../redux/slices/projectSlice'; 
import { User } from '../types';

const CreateProjectScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(state => state.directory.users);

  // Form State
  const [name, setName] = useState('');
  const [manager, setManager] = useState<User | null>(null);
  const [members, setMembers] = useState<{ user: User; role: string }[]>([]);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'manager' | 'member'>('manager');

  // Optimization: Filter users efficiently
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;
    return allUsers.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  // --- Actions ---

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a Project Name.');
      return;
    }
    if (!manager) {
      Alert.alert('Missing Info', 'Please select a Project Manager.');
      return;
    }

    const newProject = {
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
      // Check for duplicates
      const isAlreadyMember = members.some(m => m.user.id === user.id);
      const isManager = manager?.id === user.id;

      if (isAlreadyMember || isManager) {
        Alert.alert('Duplicate', 'This user is already in the project.');
        return; // Don't close modal, let them pick someone else
      }
      
      // Add member
      setMembers(prev => [...prev, { user, role: 'Developer' }]);
    }
    setModalVisible(false);
  };

  const removeMember = (userId: string) => {
    setMembers(prev => prev.filter(m => m.user.id !== userId));
  };

  const updateRole = (index: number, newRole: string) => {
    const updated = [...members];
    updated[index].role = newRole;
    setMembers(updated);
  };

  // --- Render ---

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Project Name</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="e.g. Apollo Rewrite" 
        />

        {/* Manager Section */}
        <Text style={styles.label}>Project Manager</Text>
        <TouchableOpacity style={styles.selector} onPress={() => openUserPicker('manager')}>
          <Text style={manager ? styles.selectedText : styles.placeholderText}>
            {manager ? `👤 ${manager.firstName} ${manager.lastName}` : 'Select Manager...'}
          </Text>
        </TouchableOpacity>

        {/* Members Header */}
        <View style={styles.row}>
          <Text style={styles.label}>Team Members ({members.length})</Text>
          <TouchableOpacity onPress={() => openUserPicker('member')} style={styles.addButton}>
            <Text style={styles.addLink}>+ Add Member</Text>
          </TouchableOpacity>
        </View>

        {/* Member List - Using Map instead of FlatList for stability */}
        <View style={styles.memberList}>
          {members.length === 0 && (
            <Text style={styles.emptyText}>No members added yet.</Text>
          )}
          
          {members.map((item, index) => (
            <View key={item.user.id} style={styles.memberRow}>
               <View style={{flex: 1}}>
                  <Text style={styles.memberName}>{item.user.firstName} {item.user.lastName}</Text>
                  <Text style={styles.memberJob}>{item.user.jobTitle}</Text>
               </View>
               
               {/* Role Input */}
               <TextInput 
                  style={styles.roleInput} 
                  value={item.role} 
                  onChangeText={(text) => updateRole(index, text)}
                  placeholder="Role"
                />
                
                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeMember(item.user.id)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create Project</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- USER PICKER MODAL --- */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {selectionMode === 'manager' ? 'Manager' : 'Member'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput 
            style={styles.input} 
            placeholder="Search users..." 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
            autoFocus={false}
          />
          
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={15}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                <Text style={styles.userItemText}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.userItemSub}>{item.jobTitle} • {item.department}</Text>
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
  scrollContent: { padding: 20, paddingBottom: 50 },
  
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 20, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa' },
  
  selector: { borderWidth: 1, borderColor: '#007AFF', padding: 14, borderRadius: 8, backgroundColor: '#F0F8FF' },
  selectedText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  placeholderText: { fontSize: 16, color: '#999' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  addButton: { padding: 5 },
  addLink: { color: '#007AFF', fontWeight: 'bold', fontSize: 15 },
  
  createBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 40, shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
  createBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  
  // Member List
  memberList: { marginTop: 10 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  memberName: { fontSize: 16, fontWeight: '600', color: '#333' },
  memberJob: { fontSize: 12, color: '#888' },
  roleInput: { width: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, fontSize: 13, marginRight: 10, textAlign: 'center', backgroundColor: '#fff' },
  removeBtn: { padding: 8 },
  removeText: { color: 'red', fontSize: 18, fontWeight: 'bold' },
  emptyText: { fontStyle: 'italic', color: '#999', marginTop: 10, textAlign: 'center' },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  closeBtn: { padding: 5 },
  closeText: { color: 'blue', fontSize: 16 },
  userItem: { padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  userItemText: { fontSize: 16, fontWeight: '500' },
  userItemSub: { color: '#666', fontSize: 13, marginTop: 2 }
});

export default CreateProjectScreen;