import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const DEPARTMENTS = [
  { id: '1', name: 'Engineering', icon: '🛠️', color: '#E3F2FD' },
  { id: '2', name: 'Sales', icon: '📈', color: '#E8F5E9' },
  { id: '3', name: 'Marketing', icon: '📣', color: '#FFF3E0' },
  { id: '4', name: 'HR', icon: '🤝', color: '#F3E5F5' },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DepartmentList'>;

const DepartmentScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('DepartmentList', { department: item.name })}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DEPARTMENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2} 
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 10 },
  card: {
    flex: 1,
    margin: 10,
    height: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },
  icon: { fontSize: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

export default DepartmentScreen;