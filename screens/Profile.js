import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity,
  Modal, TextInput
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [mostrarModalNome, setMostrarModalNome] = useState(false);
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const navegacao = useNavigation();

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDadosUsuario(docSnap.data());
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    buscarDadosUsuario();
  }, []);

  const sair = () => {
    auth.signOut()
      .then(() => {
        navegacao.replace('Login');
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível sair da conta.');
      });
  };

  const alterarNome = async () => {
    if (novoNome.trim().length === 0) {
      Alert.alert('Atenção', 'O nome não pode estar vazio.');
      return;
    }

    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { nome: novoNome });
      setDadosUsuario((prev) => ({ ...prev, nome: novoNome }));
      setMostrarModalNome(false);
      setNovoNome('');
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar o nome.');
    }
  };

  const alterarSenha = async () => {
    if (novaSenha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await updatePassword(auth.currentUser, novaSenha);
      setMostrarModalSenha(false);
      setNovaSenha('');
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao alterar a senha. Faça login novamente se necessário.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Perfil</Text>

      {dadosUsuario ? (
        <>
          <Text style={styles.email}>Nome: {dadosUsuario.nome}</Text>
          <Text style={styles.email}>Email: {dadosUsuario.email}</Text>

          <TouchableOpacity style={styles.botaoAlterar} onPress={() => setMostrarModalNome(true)}>
            <Text style={styles.textoBotao}>Alterar Nome</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAlterar} onPress={() => setMostrarModalSenha(true)}>
            <Text style={styles.textoBotao}>Alterar Senha</Text>
          </TouchableOpacity>

          <Text style={styles.reservaTitulo}>Reserva atual:</Text>

          {dadosUsuario.reserva ? (
            <View style={styles.cardReserva}>
              <Text style={styles.textoReserva}>Jogo: {dadosUsuario.reserva.jogo}</Text>
              <Text style={styles.textoReserva}>Data: {dadosUsuario.reserva.data}</Text>
              <Text style={styles.textoReserva}>Hora: {dadosUsuario.reserva.horario}</Text>
            </View>
          ) : (
            <Text style={styles.semReserva}>Você ainda não fez uma reserva.</Text>
          )}
        </>
      ) : (
        <Text style={styles.carregando}>Carregando dados...</Text>
      )}

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <Text style={styles.textoBotaoSair}>Sair da Conta</Text>
      </TouchableOpacity>

      
      <Modal visible={mostrarModalNome} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Alterar Nome</Text>
            <TextInput
              placeholder="Novo nome"
              style={styles.input}
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TouchableOpacity style={styles.botaoAlterar} onPress={alterarNome}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoAlterar, { backgroundColor: '#ccc' }]}
              onPress={() => setMostrarModalNome(false)}
            >
              <Text style={[styles.textoBotao, { color: '#333' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    
      <Modal visible={mostrarModalSenha} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Alterar Senha</Text>
            <TextInput
              placeholder="Nova senha"
              style={styles.input}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TouchableOpacity style={styles.botaoAlterar} onPress={alterarSenha}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoAlterar, { backgroundColor: '#ccc' }]}
              onPress={() => setMostrarModalSenha(false)}
            >
              <Text style={[styles.textoBotao, { color: '#333' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Home')}>
          <Ionicons name="home" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Games')}>
          <Ionicons name="dice" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Jogos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Agenda')}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Agenda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#F7C53C" />
          <Text style={styles.textoRodape}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083B70',
    padding: 20,
    paddingBottom: 100,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  email: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  reservaTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  cardReserva: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  textoReserva: {
    color: '#083B70',
    fontSize: 16,
  },
  semReserva: {
    color: '#eee',
    marginBottom: 20,
  },
  carregando: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
  botaoAlterar: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#083B70',
    fontWeight: 'bold',
  },
  botaoSair: {
    backgroundColor: '#F7C53C',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoSair: {
    color: '#083B70',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
});