// screens/Agenda.js
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default ({ user }) => {
  const [items, setItems] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reservas'), snap => {
      const newItems = {};
      snap.docs.forEach(d => {
        const r = d.data();
        if (r.status === 'ativo') {
          newItems[r.date] = newItems[r.date] || [];
          newItems[r.date].push({ name: r.gameName + ' às ' + r.time, height: 50 });
        }
      });
      setItems(newItems);
    });
    return unsub;
  }, []);

  return (
    <Agenda
      items={items}
      renderItem={(item) => <View style={{margin:4,padding:10,backgroundColor:'#eee'}}><Text>{item.name}</Text></View>}
    />
  );
};
