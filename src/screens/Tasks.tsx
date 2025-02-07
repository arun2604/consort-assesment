import React, { useState } from 'react'
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Permission } from 'react-native'
import { useAppDispatch, useAppSelector } from '../redux/Store'
import { addNewTask, deleteCurrentTask, editCurrentTask } from "../redux/slice/TaskSlice"

interface Task {
    id: number
    text: string
}

const Tasks: React.FC = () => {
    const [task, setTask] = useState<string>('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const dispatch = useAppDispatch();
    const { tasks } = useAppSelector(state => state.task);

    const addTask = () => {
        if (task.trim() === '') return;
        dispatch(addNewTask({ id: Date.now(), text: task }));
        setTask('');
    }

    const deleteTask = (taskId: number) => {
        dispatch(deleteCurrentTask(taskId));
    }

    const editTask = (taskId: number, newText: string) => {
        if (task.trim() === '') return;
        dispatch(editCurrentTask({ id: taskId, text: newText }));
        setEditingTask(null)
        setTask("");
    }

    const startEditing = (task: Task) => {
        setEditingTask(task)
        setTask(task.text)
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>To-Do List</Text>

            <TextInput
                value={task}
                onChangeText={setTask}
                placeholder={editingTask ? 'Edit Task' : 'Enter Task'}
                style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
            />

            <Button
                title={editingTask ? 'Update Task' : 'Add Task'}
                onPress={editingTask ? () => editTask(editingTask.id, task) : addTask}
            />

            <FlatList
                style={{ marginTop: 18 }}
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <Text style={{ flex: 1 }}>{item.text}</Text>

                        <TouchableOpacity onPress={() => startEditing(item)}>
                            <Text style={{ color: 'blue', marginRight: 10, width: 40 }}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <Text style={{ color: 'red', width: 50 }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

export default Tasks
