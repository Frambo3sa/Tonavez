import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function Home() {
  const [reserva, setReserva] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const navigation = useNavigation();

  const fetchUser = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.reserva) setReserva(data.reserva); 
        setNomeUsuario(data.nome || 'Usuário');
      } else {
        setReserva(null);
        setNomeUsuario('Usuário');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const devolverJogo = async () => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        reserva: deleteField()
      });

      const reservasRef = collection(db, 'reservas');
      const q = query(reservasRef, where('userId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      snapshot.forEach(async docSnap => await deleteDoc(doc(db, 'reservas', docSnap.id)));

      setReserva(null);
      Alert.alert('Sucesso', 'Reserva cancelada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
      console.error(error);
    }
  };

const isHojeReserva = () => {
  if (!reserva || !reserva.data) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] = reserva.data.split('-').map(Number);
  const dataReserva = new Date(ano, mes - 1, dia); 
  dataReserva.setHours(0, 0, 0, 0);

  return hoje.getTime() === dataReserva.getTime();
};





  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.saudacao}>
        <Text style={styles.titulo}>Olá {nomeUsuario}!</Text>
        <Text style={styles.subtitulo}>você já está na vez?</Text>
      </View>

      <View style={styles.cartaoReserva}>
        <Text style={styles.textoReserva}>
          {reserva
            ? `Jogo reservado: ${reserva.jogo} \nData: ${reserva.data} \nHorário: ${reserva.horario}`
            : 'Ainda sem jogos reservado!'}
        </Text>

        {reserva && (
          <TouchableOpacity
            style={[
              styles.botaoDevolver,
              { backgroundColor: isHojeReserva() ? '#083B70' : '#A9A9A9' }
            ]}
            onPress={isHojeReserva() ? devolverJogo : null}
            disabled={!isHojeReserva()}
          >
            <Text style={styles.textoBotaoDevolver}>Devolver o jogo</Text>
          </TouchableOpacity>
        )}

        {reserva && (
          <TouchableOpacity style={styles.botaoDevolver} onPress={devolverJogo}>
            <Text style={styles.textoBotaoDevolver}>Cancelar jogo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Games')}>
          <Ionicons name="dice" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Jogos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Agenda')}>
          <Ionicons name="calendar" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Videos')}>
          <Ionicons name="bulb" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Se liga só!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navigation.navigate('Games')}>
          <Ionicons name="dice" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Jogos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navigation.navigate('Agenda')}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083B70',
    paddingTop: 50,
    paddingBottom: 70,
    alignItems: 'center',
  },
  saudacao: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  cartaoReserva: {
    backgroundColor: '#F7C53C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    width: '85%',
  },
  textoReserva: {
    fontSize: 18,
    color: '#083B70',
    fontWeight: '600',
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  botao: {
    backgroundColor: '#083B70',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
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
  botaoDevolver: {
    backgroundColor: '#083B70',
    marginTop: 10,
    borderRadius: 8,
    padding: 10,
  },
  textoBotaoDevolver: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
