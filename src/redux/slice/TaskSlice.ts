import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
    id: number;
    text: string;
}

interface TaskState {
    tasks: Task[];
}

const initialState: TaskState = {
    tasks: [],
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        addNewTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        deleteCurrentTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        editCurrentTask: (state, action: PayloadAction<{ id: number; text: string }>) => {
            state.tasks = state.tasks.map((task) =>
                task.id === action.payload.id ? { ...task, text: action.payload.text } : task
            );
        },
        updateCurrentTask: (state, action: PayloadAction<{ id: number; newText: string }>) => {
            const task = state.tasks.find((task) => task.id === action.payload.id);
            if (task) {
                task.text = action.payload.newText;
            }
        },
    },
});

export const { addNewTask, deleteCurrentTask, editCurrentTask, updateCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
