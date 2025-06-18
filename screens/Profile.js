import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Profile({ navigation }) {
  const [email, setEmail] = useState(auth.currentUser.email);
  const [reserva, setReserva] = useState('');

  const fetchUserData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setReserva(data.reserva ? JSON.stringify(data.reserva) : 'Nenhuma');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, {
        email: email // Só atualizando o campo email no Firestore
      });
      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Text>Email (não editável no Auth):</Text>
      <TextInput value={email} onChangeText={setEmail} editable={false} style={styles.input} />

      <Text>Reserva atual:</Text>
      <Text>{reserva}</Text>

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
