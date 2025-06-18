// screens/Games.js
import React, { useState } from 'react';
import { View, Text, FlatList, Button, Modal, TextInput } from 'react-native';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const gamesList = [
  { id: '1', name: 'Dominó' },
  { id: '2', name: 'Xadrez' },
  { id: '3', name: 'Uno' },
];

export default ({ navigation, user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selGame, setSelGame] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const openModal = game => {
    setSelGame(game);
    setModalVisible(true);
  };

  const reservar = async () => {
    await addDoc(collection(db, 'reservas'), {
      userId: user.uid, gameId: selGame.id, gameName: selGame.name, date, time, status: 'ativo'
    });
    setModalVisible(false);
  };

  return (
    <View style={{flex:1}}>
      <FlatList
        data={gamesList}
        keyExtractor={i => i.id}
        renderItem={({item})=> (
          <View style={{padding:10,borderBottomWidth:1}}>
            <Text>{item.name}</Text>
            <Button title="Reservar" onPress={()=>openModal(item)}/>
          </View>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={{padding:20}}>
          <Text>Reserva: {selGame?.name}</Text>
          <TextInput placeholder="YYYY-MM-DD" value={date} onChangeText={setDate}/>
          <TextInput placeholder="HH:MM" value={time} onChangeText={setTime}/>
          <Button title="Confirmar" onPress={reservar}/>
          <Button title="Cancelar" onPress={()=>setModalVisible(false)}/>
        </View>
      </Modal>
    </View>
  );
};
