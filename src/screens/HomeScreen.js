import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import GetLocation from 'react-native-get-location';

import {Button} from '../components/Button';
import {Map} from '../components/Map';

export const HomeScreen = ({}) => {
  const [attachmentsUpload, setAttachmentsUpload] = useState(null);
  const [location, setLocation] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'ios') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.CAMERA'] &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE']
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

  const uploadCallback = result => {
    if (!result?.assets?.length) {
      return;
    }
    setAttachmentsUpload(result?.assets?.[0]);
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
      {!!location?.latitude && attachmentsUpload ? (
        <>
          <Image
            source={{uri: attachmentsUpload?.uri}}
            style={styles.imageStyle}
            resizeMode="cover"
          />
          <Text style={styles.text}>{'Picture Location'}</Text>
          <Map location={location} imageSource={attachmentsUpload} />
        </>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {"Let's take  picture to appear it in our map!!!"}
          </Text>
        </View>
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
  textContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '80%',
    height: '30%',
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonsContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});
