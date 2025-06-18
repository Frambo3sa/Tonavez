// screens/Login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const doLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch(e => setErr(e.message));
  };

  return (
    <View style={{padding:20}}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      {err ? <Text style={{color:'red'}}>{err}</Text> : null}
      <Button title="Login" onPress={doLogin}/>
      <Button title="Criar conta" onPress={() => navigation.navigate('Register')}/>
    </View>
  );
};
