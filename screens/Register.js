import React, { useState } from 'react';
import {View, Text, TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrarUsuario = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        email: email,
        reserva: null
      });

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao cadastrar usuário');
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Crie sua conta</Text>

      <Text style={estilos.label}>EMAIL</Text>
      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={estilos.campo}
      />

      <Text style={estilos.label}>SENHA</Text>
      <TextInput
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={estilos.campo}
      />

      <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuario}>
        <Text style={estilos.textoBotao}>Sign up</Text>
      </TouchableOpacity>

      <Text style={estilos.link} onPress={() => navigation.navigate('Login')}>
        Já tem conta? Faça login
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 30
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#083B70',
    textAlign: 'center',
    marginBottom: 30
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10
  },
  campo: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10
  },
  botao: {
    backgroundColor: '#083B70',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#777',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
