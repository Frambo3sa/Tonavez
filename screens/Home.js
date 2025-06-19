import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [reserva, setReserva] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setReserva(data.reserva);
        } else {
          setReserva(null);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a reserva.');
        console.error(error);
      }
    };

    fetchReserva();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Olá, {auth.currentUser.email}!</Text>
      <Button title="Perfil" onPress={() => navigation.navigate('Profile')} />

      <View style={styles.card}>
        {reserva ? (
          <>
            <Text>Jogo reservado: {reserva.jogo}</Text>
            <Text>Data: {reserva.data}</Text>
            <Text>Hora: {reserva.horario}</Text>
          </>
        ) : (
          <Text>Nenhum jogo reservado.</Text>
        )}
      </View>

      <Button title="Jogos" onPress={() => navigation.navigate('Games')} />
      <Button title="Agenda" onPress={() => navigation.navigate('Agenda')} />
      <Button title="Se Liga Só" onPress={() => navigation.navigate('Videos')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  header: { fontSize: 22, marginBottom: 20 },
  card: { padding: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginVertical: 20, width: '100%' }
});
