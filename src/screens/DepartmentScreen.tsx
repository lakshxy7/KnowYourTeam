import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DepartmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏢 Departments (Tab 2)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' },
  text: { fontSize: 20, fontWeight: 'bold' },
});

export default DepartmentScreen;