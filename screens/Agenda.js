import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore'; // 🔁 ALTERADO: buscar reservas
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';

export default function Agenda() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [reservasDoDia, setReservasDoDia] = useState([]);
  const [todasReservas, setTodasReservas] = useState({}); // ✅ NOVO: guardar todas reservas organizadas
  const navigation = useNavigation();

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reservas')); // ✅ NOVO: acessando a coleção 'reservas'
      const marks = {};
      const reservas = {};

      querySnapshot.forEach((docSnap) => {
        const { data: dataReserva, jogo, horario, userId } = docSnap.data();
        const dateFormatted = formatarData(dataReserva);

        // ✅ NOVO: marca a data no calendário
        marks[dateFormatted] = { marked: true, dotColor: 'blue' };

        // ✅ NOVO: adiciona reserva na lista da data
        if (!reservas[dateFormatted]) {
          reservas[dateFormatted] = [];
        }

        reservas[dateFormatted].push({
          usuario: userId,
          jogo,
          horario
        });
      });

      setMarkedDates(marks);
      setTodasReservas(reservas); // ✅ NOVO
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as reservas.');
    }
  };

  const formatarData = (dataString) => {
    // 🔁 Função mantida: Transforma "DD/MM/YYYY" em "YYYY-MM-DD"
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);

    // ✅ NOVO: atualiza as reservas do dia selecionado
    if (todasReservas[day.dateString]) {
      setReservasDoDia(todasReservas[day.dateString]);
    } else {
      setReservasDoDia([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Reservas</Text>
      
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <Text style={styles.subtitle}>Reservas do dia:</Text>

      {selectedDate && reservasDoDia.length > 0 ? (
        <FlatList
          data={reservasDoDia}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.reservaItem}>
              Usuário: {item.usuario} - Jogo: {item.jogo} - Horário: {item.horario}
            </Text>
          )}
        />
      ) : (
        <Text style={styles.noReserva}>Nenhuma reserva para este dia.</Text>
      )}

      <View style={styles.footer}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Jogos" onPress={() => navigation.navigate('Games')} />
        <Button title="Se Liga Só" onPress={() => navigation.navigate('Videos')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
  reservaItem: { marginTop: 5, padding: 6, borderBottomWidth: 1, borderColor: '#ddd' },
  noReserva: { marginTop: 10, textAlign: 'center', color: 'gray' },
  footer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }
});
