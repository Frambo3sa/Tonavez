import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        Alert.alert('Erro', 'Dados do usuário não encontrados.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {auth.currentUser.email}!</Text>
      <Button title="Editar Perfil" onPress={handleEditProfile} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reserva Atual:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : userData?.reserva ? (
          <View>
            <Text>Jogo: {userData.reserva.jogo}</Text>
            <Text>Data: {userData.reserva.data}</Text>
            <Text>Horário: {userData.reserva.horario}</Text>
            <Button title="Registrar Devolução" onPress={() => Alert.alert('Devolução registrada!')} />
          </View>
        ) : (
          <Text>Nenhuma reserva no momento.</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <Button title="Jogos" onPress={() => navigation.navigate('Games')} />
        <Button title="Se Liga Só" onPress={() => navigation.navigate('Videos')} />
        <Button title="Agenda" onPress={() => navigation.navigate('Agenda')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  card: { borderWidth: 1, padding: 15, borderRadius: 10, backgroundColor: '#f9f9f9', marginBottom: 20 },
  cardTitle: { fontWeight: 'bold', marginBottom: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around' }
});
