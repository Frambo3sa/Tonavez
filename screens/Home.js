import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function Inicio() {
  const [reserva, setReserva] = useState(null);
  const navegacao = useNavigation();

  useEffect(() => {
    const buscarReserva = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const dados = userDoc.data();
          setReserva(dados.reserva);
        } else {
          setReserva(null);
        }
      } catch (erro) {
        console.error('Erro ao buscar reserva:', erro);
      }
    };

    buscarReserva();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.saudacao}>
        <Text style={styles.titulo}>Olá {auth.currentUser.displayName || 'Usuário'}!</Text>
        <Text style={styles.subtitulo}>você já está na vez?</Text>
      </View>

      <View style={styles.cartaoReserva}>
        <Text style={styles.textoReserva}>
          {reserva ? `Jogo reservado: ${reserva.jogo}` : 'Ainda sem jogos reservado!'}
        </Text>
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botao} onPress={() => navegacao.navigate('Games')}>
          <Ionicons name="dice" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Jogos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navegacao.navigate('Agenda')}>
          <Ionicons name="calendar" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navegacao.navigate('Videos')}>
          <Ionicons name="bulb" size={32} color="#fff" />
          <Text style={styles.textoBotao}>Se liga só!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Games')}>
          <Ionicons name="dice" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Jogos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Agenda')}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#fff" />
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
    paddingTop: 50,
    paddingBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saudacao: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitulo: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  cartaoReserva: {
    backgroundColor: '#F7C53C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    width: '85%',
  },
  textoReserva: {
    fontSize: 18,
    color: '#083B70',
    fontWeight: '600',
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  botao: {
    backgroundColor: '#083B70',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
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
});
