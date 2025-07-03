import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,FlatList,Alert,ScrollView,} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Agenda() {
  const [datasMarcadas, setDatasMarcadas] = useState({});
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [reservasDoDia, setReservasDoDia] = useState([]);
  const [todasReservas, setTodasReservas] = useState({});
  const navegacao = useNavigation();

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reservas'));
      const marks = {};
      const reservas = {};

      querySnapshot.forEach((docSnap) => {
        const { data: dataReserva, jogo, horario } = docSnap.data();
        const dataFormatada = formatarData(dataReserva);

        marks[dataFormatada] = { marked: true, dotColor: '#F7C53C' };

        if (!reservas[dataFormatada]) {
          reservas[dataFormatada] = [];
        }

        reservas[dataFormatada].push({ jogo, horario });
      });

      setDatasMarcadas(marks);
      setTodasReservas(reservas);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as reservas.');
      console.error(error);
    }
  };

  const formatarData = (dataString) => dataString;

  const aoSelecionarDia = (day) => {
    setDataSelecionada(day.dateString);
    setReservasDoDia(todasReservas[day.dateString] || []);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Agenda de Reservas</Text>

        <Calendar
          markedDates={datasMarcadas}
          onDayPress={aoSelecionarDia}
          theme={{
            calendarBackground: '#fff',
            textSectionTitleColor: '#083B70',
            selectedDayBackgroundColor: '#F7C53C',
            todayTextColor: '#F7C53C',
            dayTextColor: '#000',
            arrowColor: '#083B70',
          }}
        />

        <Text style={styles.subtitulo}>Reservas do dia:</Text>

        {dataSelecionada && reservasDoDia.length > 0 ? (
          reservasDoDia.map((item, index) => (
            <View key={index} style={styles.cartaoReserva}>
              <Text style={styles.textoReserva}>
                <Text style={{ fontWeight: 'bold' }}>Jogo:</Text> {item.jogo}
              </Text>
              <Text style={styles.textoReserva}>
                <Text style={{ fontWeight: 'bold' }}>Horário:</Text> {item.horario}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.semReserva}>Nenhuma reserva para este dia.</Text>
        )}

        <View style={{ height: 90 }} /> 
      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Home')}>
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Games')}>
          <Ionicons name="dice" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Jogos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Agenda')}>
          <Ionicons name="calendar" size={24} color="#F7C53C" />
          <Text style={styles.textoRodape}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#083B70' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  titulo: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  cartaoReserva: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  textoReserva: {
    fontSize: 16,
    color: '#083B70',
  },
  semReserva: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#052C52',
    paddingVertical: 15,
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemRodape: {
    alignItems: 'center',
  },
  textoRodape: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});