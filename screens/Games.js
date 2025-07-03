import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Alert,Image,Platform,SafeAreaView,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';
import { auth, db } from '../firebaseConfig';

const jogos = [
  { id: '1', nome: 'Futebol de Mesa', imagem: require('../imagens/futebol.png') },
  { id: '2', nome: 'Tênis de Mesa', imagem: require('../imagens/tenis.png') },
  { id: '3', nome: 'Xadrez', imagem: require('../imagens/xadrez.png') },
];

export default function Games() {
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [data, setData] = useState(new Date());
  const navegacao = useNavigation();

  const reservarJogo = async () => {
    if (!jogoSelecionado) {
      Alert.alert('Selecione um jogo primeiro!');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const agora = new Date();

      if (userDoc.exists() && userDoc.data().reserva) {
        const reservaExistente = userDoc.data().reserva;
        const dataHoraReserva = new Date(`${reservaExistente.data}T${reservaExistente.horario}`);
        if (dataHoraReserva > agora) {
          Alert.alert('Você já tem uma reserva ativa!', 'Devolva o jogo antes de reservar outro.');
          return;
        }
      }

      const reserva = {
        userId: auth.currentUser.uid,
        jogo: jogoSelecionado.nome,
        data: data.toISOString().split('T')[0],
        horario: data.toTimeString().split(' ')[0],
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), { reserva }, { merge: true });
      await addDoc(collection(db, 'reservas'), reserva);

      Alert.alert('Sucesso', 'Jogo reservado com sucesso!');
      navegacao.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reservar o jogo.');
      console.error(error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setMostrarPicker(Platform.OS === 'ios');
    setData(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.textoSelecao}>Escolha um jogo para reservar:</Text>

        {jogos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.cardJogo,
              jogoSelecionado?.id === item.id && styles.cardSelecionado,
            ]}
            onPress={() => setJogoSelecionado(item)}
          >
            <View style={styles.areaImagem}>
              <Image source={item.imagem} style={styles.imagemJogo} />
            </View>
            <Text style={styles.nomeJogo}>{item.nome}</Text>
          </TouchableOpacity>
        ))}

        {jogoSelecionado && (
          <View style={styles.secaoReserva}>
            <Text style={styles.detalhe}>Selecionado: {jogoSelecionado.nome}</Text>

            <TouchableOpacity style={styles.botaoData} onPress={() => setMostrarPicker(true)}>
              <Text style={styles.textoBotaoData}>Escolher Data e Hora</Text>
            </TouchableOpacity>

            {mostrarPicker &&
              (Platform.OS === 'web' ? (
                <ReactDatePicker
                  selected={data}
                  onChange={(date) => setData(date)}
                  showTimeSelect
                  dateFormat="Pp"
                />
              ) : (
                <DateTimePicker
                  value={data}
                  mode="datetime"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              ))}

            <TouchableOpacity style={styles.botaoReservar} onPress={reservarJogo}>
              <Text style={styles.textoBotaoReservar}>Reservar Jogo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <TouchableOpacity style={styles.itemRodape} onPress={() => navegacao.navigate('Home')}>
          <Ionicons name="home" size={24} color="#F7C53C" />
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
          <Ionicons name="person" size={24} color="#fff" />
          <Text style={styles.textoRodape}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#083B70' },
  scrollContent: { padding: 20, paddingBottom: 200, flexGrow: 1 },
  textoSelecao: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  cardJogo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardSelecionado: { borderColor: 'green', borderWidth: 2 },
  nomeJogo: { fontSize: 18, color: '#083B70', fontWeight: '600', marginTop: 10 },
  areaImagem: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagemJogo: { width: '100%', height: '100%', resizeMode: 'cover' },
  secaoReserva: { marginTop: 20, alignItems: 'center', paddingHorizontal: 20 },
  detalhe: { color: '#fff', fontSize: 16, marginBottom: 10 },
  botaoData: {
    backgroundColor: '#F7C53C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  textoBotaoData: { fontWeight: 'bold', color: '#083B70' },
  botaoReservar: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotaoReservar: { color: '#083B70', fontWeight: 'bold' },
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
  itemRodape: { alignItems: 'center' },
  textoRodape: { color: '#fff', fontSize: 12, marginTop: 4 },
});