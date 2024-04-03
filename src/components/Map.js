import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, View, useColorScheme, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

export const Map = React.memo(({location, imageSource}) => {
  const mapRef = useRef();
  const iconMarkerRef = useRef();

  const systemColorSchema = useColorScheme();

  const regionInfos = useMemo(
    () => ({
      ...(location ?? defaultLatLong),
      latitudeDelta: 0.09,
      longitudeDelta: 0.09,
    }),
    [location],
  );

  const fitToCoords = useCallback(() => {
    const coordinates = [location, defaultLatLong];

    if (imageSource) {
      mapRef.current?.fitToCoordinates?.(coordinates, {
        animated: true,
        edgePadding: EDGE_PADDING,
      });
    }
  }, [imageSource, location]);

  useEffect(() => {
    if (!location.latitude && !location.latitude) {
      return;
    }
    fitToCoords();
  }, [fitToCoords, location.latitude]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        userInterfaceStyle={systemColorSchema}
        initialRegion={regionInfos}
        region={regionInfos}>
        {!!imageSource?.uri && (
          <Marker
            ref={iconMarkerRef}
            coordinate={location}
            identifier="iconMarker"
          />
        )}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '50%',
    width: '90%',
    alignSelf: 'center',
  },
  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

const defaultLatLong = {
  latitude: 24.679822,
  longitude: 46.672739,
};

const EDGE_PADDING = {
  top: 50,
  bottom: 50,
  right: 0,
  left: 50,
};
