import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível sair da conta.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {userData ? (
        <>
          <Text>Email: {userData.email}</Text>
          <Text>Reserva atual:</Text>
          {userData.reserva ? (
            <View style={styles.card}>
              <Text>Jogo: {userData.reserva.jogo}</Text>
              <Text>Data: {userData.reserva.data}</Text>
              <Text>Hora: {userData.reserva.horario}</Text>
            </View>
          ) : (
            <Text>Você ainda não fez uma reserva.</Text>
          )}
        </>
      ) : (
        <Text>Carregando dados...</Text>
      )}

      <Button title="Sair da Conta" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  card: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center'
  }
});
