import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore'; // ✅ Incluído addDoc
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const jogos = [
  { id: '1', nome: 'Futebol de Mesa' },
  { id: '2', nome: 'Tênis de Mesa' },
  { id: '3', nome: 'Xadrez' }
];

export default function Games() {
  const [selectedJogo, setSelectedJogo] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const navigation = useNavigation();

  const reservarJogo = async () => {
    if (!selectedJogo) {
      Alert.alert('Selecione um jogo primeiro!');
      return;
    }

    try {
      const reservaData = {
        userId: auth.currentUser.uid, // ✅ Identificador do usuário
        jogo: selectedJogo.nome,
        data: date.toLocaleDateString(),
        horario: date.toLocaleTimeString()
      };

      // ✅ Atualiza a reserva no documento do usuário (coleção "users")
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        reserva: reservaData
      });

      // ✅ Salva a mesma reserva em uma nova entrada da coleção "reservas"
      await addDoc(collection(db, 'reservas'), reservaData);

      Alert.alert('Sucesso', 'Jogo reservado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reservar o jogo.');
      console.error(error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha um jogo para reservar:</Text>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.nome}
            onPress={() => setSelectedJogo(item)}
            color={selectedJogo?.id === item.id ? 'green' : 'blue'}
          />
        )}
      />

      {selectedJogo && (
        <View style={styles.reservaSection}>
          <Text>Selecionado: {selectedJogo.nome}</Text>
          <Button title="Escolher Data e Hora" onPress={() => setShowPicker(true)} />
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <Button title="Reservar Jogo" onPress={reservarJogo} color="purple" />
        </View>
      )}

      <View style={styles.footer}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Agenda" onPress={() => navigation.navigate('Agenda')} />
        <Button title="Se Liga Só" onPress={() => navigation.navigate('Videos')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  reservaSection: { marginTop: 20, alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }
});
