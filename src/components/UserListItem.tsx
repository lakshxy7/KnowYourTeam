import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from '../types';

interface Props {
  user: User;
  onPress: (user: User) => void;
}

const UserListItem = ({ user, onPress }: Props) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(user)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: user.avatarThumb }} 
        style={styles.avatar} 
        defaultSource={{ uri: 'https://via.placeholder.com/50' }} 
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.role}>
          {user.jobTitle} • {user.department}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e4e8', 
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
});

export default React.memo(UserListItem);