import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import { RootStackParamList } from '../navigation/AppNavigator';
import UserListItem from '../components/UserListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'DepartmentList'>;

const DepartmentListScreen = ({ route, navigation }: Props) => {
  const { department } = route.params;
  const allUsers = useAppSelector((state) => state.directory.users);
  const filteredUsers = allUsers.filter((user) => user.department === department);

  return (
    <View style={styles.container}>
      {filteredUsers.length === 0 ? (
        <View style={styles.center}>
          <Text>No employees found in {department}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem 
              user={item} 
              onPress={(user) => navigation.navigate('EmployeeDetails', { user })} 
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DepartmentListScreen;