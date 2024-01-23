import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, ScrollView, Modal, Alert } from "react-native";
import axios from "axios";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const API_URL = "https://todolist-b8hr.onrender.com";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedTodoTitle, setUpdatedTodoTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll/Todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching To-Dos:", error.message);
    }
  };

  const createTodo = async () => {
    try {
      await axios.post(`${API_URL}/PostTodos/Todos`, { title: newTodoTitle });
      fetchTodos();
      setNewTodoTitle("");
      showAlert("To-Do created successfully");
    } catch (error) {
      console.error("Error creating To-Do:", error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/Todos/${id}`);
      fetchTodos();
      showAlert("To-Do deleted successfully");
    } catch (error) {
      console.error("Error deleting To-Do:", error.message);
    }
  };

  const openUpdateModal = (todo) => {
    setSelectedTodo(todo);
    setUpdatedTodoTitle(todo.title);
    setUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalVisible(false);
    setSelectedTodo(null);
    setUpdatedTodoTitle("");
  };

  const updateTodo = async () => {
    try {
      await axios.put(`${API_URL}/update/Todos/${selectedTodo._id}`, {
        title: updatedTodoTitle,
        completed: selectedTodo.completed,
      });
      fetchTodos();
      closeUpdateModal();
      showAlert("To-Do updated successfully");
    } catch (error) {
      console.error("Error updating To-Do:", error.message);
    }
  };

  const showAlert = (message) => {
    Alert.alert("Success", message, [{ text: "OK" }]);
  };

  return (
    <ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new To-Do"
          value={newTodoTitle}
          onChangeText={(text) => setNewTodoTitle(text)}
        />
        <Pressable style={styles.addButton} onPress={createTodo}>
          <AntDesign name="pluscircle" size={30} color="#007FFF" />
        </Pressable>
      </View>

      <ScrollView>
        {todos.map((todo) => (
          <View key={todo._id} style={styles.todoItem}>
            <Text style={{ flex: 1 }}>{todo.title}</Text>
            <Pressable onPress={() => openUpdateModal(todo)}>
              <FontAwesome name="pencil-square-o" size={24} color="#007FFF" />
            </Pressable>
            <Pressable onPress={() => deleteTodo(todo._id)}>
              <FontAwesome name="trash" size={24} color="#FF0000" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Update Todo Modal */}
      <Modal visible={updateModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Update To-Do"
            value={updatedTodoTitle}
            onChangeText={(text) => setUpdatedTodoTitle(text)}
          />
          <Pressable style={styles.updateButton} onPress={updateTodo}>
            <Text style={{ color: "white" }}>Update</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={closeUpdateModal}>
            <Text style={{ color: "white" }}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#7CB9E8",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#007FFF",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
