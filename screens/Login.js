import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
       
        navigation.navigate('Home');
      })
      .catch(() => {
        Alert.alert('Erro', 'Email ou senha inválidos!');
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../imagens/logoTNV.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      

      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        placeholder="Digite seu email"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        style={styles.campo}
      />

      <Text style={styles.label}>SENHA</Text>
      <TextInput
        placeholder="Digite sua senha"
        placeholderTextColor="#bbb"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.campo}
      />

      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.textoBotao}>Logar</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Não possui uma conta?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#074c84', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 25
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D3D3D3',
    marginTop: 10
  },
  campo: {
    width: '100%',
    backgroundColor: '#ffffff',
    color: '#000',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8
  },
  botao: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#083B70',
    fontWeight: 'bold'
  },
  link: {
    marginTop: 20,
    color: '#D3D3D3',
    textDecorationLine: 'underline'
  }
});