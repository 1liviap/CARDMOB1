import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Alert,
  Image,
} from 'react-native';


const BASE_URL = 'http://10.81.205.5:3000'; // use o IP da sua máquina

export default function App() {
  const [compras, setCompras] = useState([]);
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState('');
  const [editQtd, setEditQtd] = useState('');

  const fetchCompras = async () => {
    try {
      const res = await fetch(`${BASE_URL}/compras`);
      const data = await res.json();
      setCompras(data);
    } catch (err) {
      console.error('Erro ao buscar:', err);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  const addCompra = async () => {
    if (item.trim() === '' || quantidade.trim() === '') return;

    try {
      await fetch(`${BASE_URL}/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: item.trim(), quantidade: Number(quantidade) }),
      });
      setItem('');
      setQuantidade('');
      fetchCompras();
    } catch (err) {
      console.error('Erro ao adicionar:', err);
    }
  };

  const updateCompra = async (id) => {
    try {
      await fetch(`${BASE_URL}/compras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editItem, quantidade: Number(editQtd) }),
      });
      setEditId(null);
      setEditItem('');
      setEditQtd('');
      fetchCompras();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
    }
  };

  const deleteCompra = async (id) => {
    Alert.alert('Excluir', 'Deseja excluir o item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await fetch(`${BASE_URL}/compras/${id}`, { method: 'DELETE' });
          fetchCompras();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    if (item.id === editId) {
      return (
        <View style={styles.item}>
          <TextInput
            style={styles.editInput}
            placeholder="Item"
            value={editItem}
            onChangeText={setEditItem}
          />
          <TextInput
            style={styles.editInput}
            placeholder="Qtd"
            value={editQtd.toString()}
            onChangeText={setEditQtd}
            keyboardType="numeric"
          />
          <Button title="Atualizar" onPress={() => updateCompra(item.id)} />
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>
            {item.item} - {item.quantidade}
          </Text>
          <View style={styles.buttons}>
            <Button
              title="Editar"
              onPress={() => {
                setEditId(item.id);
                setEditItem(item.item);
                setEditQtd(item.quantidade.toString());
              }}
            />
            <Button title="Excluir" onPress={() => deleteCompra(item.id)} />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={item}
        onChangeText={setItem}
        placeholder="Item"
      />
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Quantidade"
        keyboardType="numeric"
      />
      <Button title="Adicionar" onPress={addCompra} />

      <FlatList
        data={compras}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <Text style={styles.text}>Lista de Compras</Text>
     


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: { marginTop: 20 },
  item: {
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    marginBottom: 5,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    marginTop: 30,
    textAlign: 'center',
  },
});