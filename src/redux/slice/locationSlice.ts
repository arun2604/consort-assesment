import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    insideGeofence: boolean;
}

const initialState: LocationState = {
    latitude: null,
    longitude: null,
    insideGeofence: false,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        updateLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        },
        setInsideGeofence: (state, action: PayloadAction<boolean>) => {
            state.insideGeofence = action.payload;
        },
    },
});

export const { updateLocation, setInsideGeofence } = locationSlice.actions;
export default locationSlice.reducer;
