import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyTeamScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>❤️ My Team (Tab 3)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' },
  text: { fontSize: 20, fontWeight: 'bold' },
});

export default MyTeamScreen;