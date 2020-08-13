import React from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'

import logo from '../../assets/logo.png';
import styles from './styles';

function Home() {

    const navigation = useNavigation()

    function handleNavigateToPoints() {
        navigation.navigate('Points')
    }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={logo} />
        <Text style={styles.title}>Seu Marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>

        <View style={styles.footer}></View>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
                <Icon name='arrow-right' color='#fff' size={24}/>
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

export default Home;
