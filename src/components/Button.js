import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export const Button = memo(({onPress, text, disabled}) => {
  return (
    <TouchableOpacity
      testID={'MyButton'}
      onPress={onPress}
      style={styles.containerButton}
      disabled={disabled}>
      <Text testID={'MyButton:Text'} style={styles.buttonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  containerButton: {
    borderRadius: 8,
    backgroundColor: '#5365B9',
    height: 50,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
