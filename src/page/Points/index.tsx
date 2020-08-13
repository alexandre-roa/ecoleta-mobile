import React, { useState, useEffect } from 'react';
import { View, Text, Image, SafeAreaView, Alert } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SvgUri } from 'react-native-svg';
import api from '../../service/api';

import styles from './styles';

interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
}

function Points() {
  const navigation = useNavigation();

  const [items, setItems] = useState<ItemProps[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [inicialPosition, setInicialPosition] = useState<[number, number]>([
    0,
    0
  ]);

  useEffect(() => {
    api
      .get('points', {
        params: {
          city: 'Porto Feliz',
          uf: 'SP',
          items: [1, 3]
        }
      })
      .then(response => {
        setPoints(response.data);
      });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Ooooops...',
          'Precisamos de sua permissão para obter a localização'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInicialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Details', { point_id: id });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name='arrow-left' size={20} color='#34cb79' />
        </TouchableOpacity>
        <Text style={styles.title}>Bem Vindo!</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta
        </Text>

        <View style={styles.mapContainer}>
          {inicialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              loadingEnabled={inicialPosition[0] === 0}
              initialRegion={{
                latitude: inicialPosition[0],
                longitude: inicialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {items.map(item => (
            <TouchableOpacity
              key={String(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {}
              ]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Points;
