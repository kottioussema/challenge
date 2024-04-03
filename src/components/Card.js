import React, {memo} from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

import {Map} from './Map';

export const Card = memo(({location, attachmentUpload}) => {
  return (
    <>
      {!!location?.latitude && !!attachmentUpload ? (
        <>
          <Image
            source={{uri: attachmentUpload?.uri}}
            style={styles.imageStyle}
            resizeMode="cover"
          />
          <Text style={styles.text}>{'Picture Location'}</Text>
          <Map location={location} imageSource={attachmentUpload} />
        </>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {"Let's take  picture to appear it in our map!!!"}
          </Text>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  textContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    marginLeft: 5,
  },
  imageStyle: {
    width: '80%',
    height: '30%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    alignSelf: 'center',
  },
});
