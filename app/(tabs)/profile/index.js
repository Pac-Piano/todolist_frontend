import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, Pressable, FlatList, Alert, Button } from "react-native";
import axios from "axios";
import Image1 from "../home/gakuru.jpg";

const Index = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`https://todolist-b8hr.onrender.com/changeStatusTocompleted/${id}`, {
        status: newStatus,
      });

      if (response.data) {
        Alert.alert("Success", `Task status changed to ${newStatus}`);
        // Refresh the task lists
        fetchTasks();
      } else {
        Alert.alert("Error", "Failed to change task status");
      }
    } catch (error) {
      console.error("Error changing status:", error.message);
      Alert.alert("Error", "Failed to change task status");
    }
  };

  const fetchTasks = () => {
    // Fetch pending tasks
    axios.get("https://todolist-b8hr.onrender.com/getPending/Todos")
      .then(response => setPendingTasks(response.data))
      .catch(error => console.error("Error fetching pending tasks:", error));

    // Fetch completed tasks
    axios.get("https://todolist-b8hr.onrender.com/getCompleted/Todos")
      .then(response => setCompletedTasks(response.data))
      .catch(error => console.error("Error fetching completed tasks:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={Image1}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Pending and Completed Tasks
            </Text>
          </View>
        </View>

        <View style={{ marginVertical: 12 }}>
          <Text>Tasks Overview</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginVertical: 8,
            }}
          >

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginVertical: 8 }}>
              <View
                style={{
                  backgroundColor: "#89CFF0",
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
                  {pendingTasks.length}
                </Text>
                <Text style={{ marginTop: 4 }}>Pending tasks</Text>
              </View>

              <View
                style={{
                  backgroundColor: "#89CFF0",
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold" }}>
                  {completedTasks.length}
                </Text>
                <Text style={{ marginTop: 4 }}>Completed tasks</Text>
              </View>
            </View>

          </View>
        </View>

        <View
          style={{
            backgroundColor: "#89CFF0",
            padding: 10,
            borderRadius: 6,
            marginTop: 15,
          }}
        >
          <Pressable>
            <Text style={{ textAlign: "center", color: "white" }}>
              Completed Task and pending Task
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 12 }}>Pending Tasks:</Text>
          <FlatList
            data={pendingTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text>{item.title}</Text>
                <Text style={{ color: "orange", marginLeft: 10, marginRight: 5 }}>{item.status}</Text>
                <Button
                  title="Complete"
                  onPress={() => handleStatusChange(item._id, "completed")}
                  color="green"
                  style={{ fontSize: 5, padding: 5 }}
                />
              </View>
            )}
          />

          <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: 20 }}>
            Completed Tasks:
          </Text>
          <FlatList
            data={completedTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text>{item.title}</Text>
                <Text style={{ color: "green", marginLeft: 10 }}>{item.status}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Index;
