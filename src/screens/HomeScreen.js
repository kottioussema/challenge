import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';
import RNFS from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

import ExifReader from '../../node_modules/exifreader/src/exif-reader.js';
import {Button} from '../components/Button';
import {Card} from '../components/Card';

export const HomeScreen = ({}) => {
  const [attachmentUpload, setattachmentUpload] = useState(null);
  const [location, setLocation] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ]);

        if (
          granted['android.permission.CAMERA'] &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] &&
          granted['android.permission.ACCESS_MEDIA_LOCATION'] &&
          granted['android.permission.READ_MEDIA_IMAGES']
        ) {
          console.log('Camera permission given');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.log('*** Camera Permission error ***', err);
      }
    }
  };

  useEffect(() => {
    if (attachmentUpload) {
      getCoordinatesFromExif();
    }
  }, [attachmentUpload, getCoordinatesFromExif]);

  const getImageLocation = () => {
    setDisabled(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
    })
      .then(res => {
        setLocation({
          latitude: res?.latitude,
          longitude: res?.longitude,
        });
        setDisabled(false);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const getCoordinatesFromExif = useCallback(async () => {
    try {
      const b64Buffer = await RNFS?.readFile(
        attachmentUpload?.originalPath,
        'base64',
      );
      const fileBuffer = decode(b64Buffer);
      const tags = ExifReader.load(fileBuffer, {expanded: true});
      const latitude = tags.gps.Latitude;
      const longitude = tags.gps.Longitude;
      setCoordinates({latitude, longitude});
    } catch (error) {
      console.error('Error reading EXIF data:', error);
    }
  }, [attachmentUpload]);

  const uploadCallback = async result => {
    if (!result?.assets?.length) {
      return;
    }
    setattachmentUpload(result?.assets?.[0]);
  };

  const onLaunchCamera = async () => {
    const options = {
      quality: 1,
      mediaType: 'photo',
    };
    setDisabled(true);
    await requestCameraPermission();
    getImageLocation();
    await launchCamera(options, uploadCallback);
  };

  const onLaunchImage = async () => {
    const options = {
      quality: 1,
      selectionLimit: 1,
      mediaType: 'photo',
    };
    setDisabled(true);
    await requestCameraPermission();
    getImageLocation();
    await launchImageLibrary(options, uploadCallback);
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Card location={location} attachmentUpload={attachmentUpload} />
      {!!coordinates?.latitude && (
        <Text
          style={
            styles.text
          }>{`latitude: ${coordinates?.latitude}  longitude: ${coordinates?.longitude} `}</Text>
      )}

      <View style={styles.buttonsContainer}>
        <Button
          text={'Take picture'}
          onPress={onLaunchCamera}
          disabled={disabled}
        />
        <Button
          text={'Upload picture'}
          onPress={onLaunchImage}
          disabled={disabled}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  buttonsContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    marginLeft: 5,
  },
});
