import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
  Image,
} from "react-native";

const BASE_URL = "http://10.0.2.2:5000";

export default function App() {
  const [catalog, setCatalog] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  const fetchCatalog = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/catalog?page=1`);
      const data = await res.json();
      setCatalog(data.catalog);
    } catch (error) {
      console.error("Erro ao buscar catálogo:", error);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const adicionarItem = async () => {
    if (!nome.trim() || !preco.trim() || !descricao.trim()) return;

    try {
      await fetch(`${BASE_URL}/api/catalog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome.trim(),
          price: parseFloat(preco),
          description: descricao.trim(),
        }),
      });
      setNome("");
      setPreco("");
      setDescricao("");
      fetchCatalog();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  const atualizarItem = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/catalog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editNome,
          price: parseFloat(editPreco),
          description: editDescricao,
        }),
      });
      setEditandoId(null);
      setEditNome("");
      setEditPreco("");
      setEditDescricao("");
      fetchCatalog();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  const deletarItem = (id) => {
    Alert.alert("Confirmar", "Deseja apagar este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${BASE_URL}/api/catalog/${id}`, { method: "DELETE" });
            fetchCatalog();
          } catch (error) {
            console.error("Erro ao deletar item:", error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    if (item.id === editandoId) {
      return (
        <View style={styles.item}>
          <TextInput
            style={styles.editInput}
            value={editNome}
            onChangeText={setEditNome}
            placeholder="Nome"
          />
          <TextInput
            style={styles.editInput}
            value={editPreco.toString()}
            onChangeText={setEditPreco}
            placeholder="Preço"
            keyboardType="decimal-pad"
          />
          <TextInput
            style={styles.editInput}
            value={editDescricao}
            onChangeText={setEditDescricao}
            placeholder="Descrição"
          />
          <Button
            title="Salvar"
            color="#7e57c2"
            onPress={() => atualizarItem(item.id)}
          />
        </View>
      );
    }

    return (
      <View style={styles.item}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemPreco}>R$ {item.price.toFixed(2)}</Text>
          <Text style={styles.itemDescricao}>{item.description}</Text>
        </View>
        <View style={styles.buttons}>
          <Button
            title="Editar"
            color="#9575cd"
            onPress={() => {
              setEditandoId(item.id);
              setEditNome(item.name);
              setEditPreco(item.price.toString());
              setEditDescricao(item.description);
            }}
          />
          <Button
            title="Excluir"
            color="#ab47bc"
            onPress={() => deletarItem(item.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Produtos</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome do produto"
      />
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        placeholder="Preço"
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição"
      />
      <View style={{ marginBottom: 10 }}>
        <Button title="Adicionar Produto" color="#673ab7" onPress={adicionarItem} />
      </View>

      <FlatList
        data={catalog}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#512da8",
  },
  input: {
    height: 40,
    borderColor: "#b39ddb",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  list: { marginTop: 10 },
  item: {
    flexDirection: "column",
    backgroundColor: "#e8eaf6",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#311b92",
  },
  itemPreco: {
    fontSize: 15,
    color: "#5e35b1",
  },
  itemDescricao: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editInput: {
    height: 40,
    borderColor: "#b39ddb",
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
});
