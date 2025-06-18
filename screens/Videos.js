import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const videos = [
  { id: '1', titulo: 'Tutorial Xadrez', url: 'https://www.youtube.com/embed/NAIQyoPcjNM' },
  { id: '2', titulo: 'Tutorial Tênis de Mesa', url: 'https://www.youtube.com/embed/kOaqN4ap5aA' },
  { id: '3', titulo: 'Tutorial Futebol de Mesa', url: 'https://www.youtube.com/embed/8vNzSnjEu1g' }
];

export default function Videos() {
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const navigation = useNavigation();

  const abrirVideo = (url) => {
    setVideoSelecionado(url);
  };

  const fecharVideo = () => {
    setVideoSelecionado(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se Liga Só - Tutoriais</Text>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.titulo} onPress={() => abrirVideo(item.url)} />
        )}
      />

      <Modal visible={!!videoSelecionado} animationType="slide">
        <View style={{ flex: 1 }}>
          <Button title="Fechar Vídeo" onPress={fecharVideo} />
          <WebView
            source={{ uri: videoSelecionado }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
          />
        </View>
      </Modal>

      <View style={styles.footer}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Jogos" onPress={() => navigation.navigate('Games')} />
        <Button title="Agenda" onPress={() => navigation.navigate('Agenda')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }
});
