// screens/Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default ({ user }) => {
  const [reserva, setReserva] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'reservas'),
      where('userId', '==', user.uid),
      where('status', '==', 'ativo'));
    return onSnapshot(q, snap => {
      const doc = snap.docs[0];
      if (doc) setReserva({ id: doc.id, ...doc.data() });
      else setReserva(null);
    });
  }, []);

  const devolver = () => {
    updateDoc(doc(db, 'reservas', reserva.id), { status: 'devolvido' });
  };

  return (
    <View style={{padding:20}}>
      <Text>Olá, {user.email}</Text>
      {reserva ? (
        <View style={{borderWidth:1,padding:10,margin:10}}>
          <Text>Reserva: {reserva.gameName}</Text>
          <Text>Data: {reserva.date} - {reserva.time}</Text>
          <Button title="Registrar devolução" onPress={devolver}/>
        </View>
      ) : (
        <Text>Você não tem reservas ativas</Text>
      )}
    </View>
  );
};
