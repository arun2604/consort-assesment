import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, PermissionsAndroid, Platform, Alert, Modal, TextInput, Button } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateLocation, setInsideGeofence } from "../redux/slice/locationSlice";
import { useAppDispatch, useAppSelector } from "../redux/Store";

const OFFICE_LAT = 11.0255797;
const OFFICE_LNG = 76.9143727;
const GEOFENCE_RADIUS = 30;
const OFFICE_START_TIME = "09:00";
const OFFICE_END_TIME = "19:00";

const LoginStatus: React.FC = () => {
    const dispatch = useAppDispatch();
    const { insideGeofence } = useAppSelector((state) => state.location);
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [promptType, setPromptType] = useState<"late" | "early" | null>(null);

    const insideGeofenceRef = useRef(insideGeofence);

    useEffect(() => {
        insideGeofenceRef.current = insideGeofence;
    }, [insideGeofence]);

    useEffect(() => {
        resetDailyData();
        requestLocationPermission();
        const watchId = Geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log(accuracy, "accuracy");
                dispatch(updateLocation({ latitude, longitude }));
                await checkGeofence(latitude, longitude);
            },
            (error) => console.log("Location Error:", error),
            { enableHighAccuracy: true, distanceFilter: 5 }
        );

        return () => Geolocation.clearWatch(watchId);
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("Permission Denied", "Location permission is required for geofencing.");
            }
        }
    };

    const checkGeofence = async (lat: number, lng: number) => {
        const distance = getDistance(lat, lng, OFFICE_LAT, OFFICE_LNG);
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        console.log(distance, distance <= GEOFENCE_RADIUS, insideGeofenceRef.current);

        const hasEnteredToday = await AsyncStorage.getItem("hasEnteredToday");
        const hasExitedToday = await AsyncStorage.getItem("hasExitedToday");

        if (distance <= GEOFENCE_RADIUS && !insideGeofenceRef.current) {
            console.log("inside In dialouge")

            dispatch(setInsideGeofence(true));
            insideGeofenceRef.current = true;

            showToast("Entered Office");
            await AsyncStorage.setItem("hasEnteredToday", "true");

            if (currentTime > OFFICE_START_TIME) {
                triggerPrompt("late");
            }

        }
        else if (distance > GEOFENCE_RADIUS && insideGeofenceRef.current) {
            console.log("inside Out dialouge")
            dispatch(setInsideGeofence(false));
            insideGeofenceRef.current = false;
            showToast("Exited Office");
            await AsyncStorage.setItem("hasExitedToday", "true");

            if (currentTime < OFFICE_END_TIME) {
                triggerPrompt("early");
            }

        }
    };

    // const checkGeofence = async (lat: number, lng: number) => {
    //     const distance = getDistance(lat, lng, OFFICE_LAT, OFFICE_LNG);
    //     const now = new Date();
    //     const currentTime = now.toTimeString().slice(0, 5);

    //     console.log(distance, distance <= GEOFENCE_RADIUS, insideGeofence);

    //     const hasEnteredToday = await AsyncStorage.getItem("hasEnteredToday");
    //     const hasExitedToday = await AsyncStorage.getItem("hasExitedToday");

    //     if (distance <= GEOFENCE_RADIUS && !insideGeofence) {
    //         console.log("inside In dialouge")

    //         dispatch(setInsideGeofence(true));

    //         if (!hasEnteredToday) {
    //             showToast("Entered Office");
    //             await AsyncStorage.setItem("hasEnteredToday", "true");

    //             if (currentTime > OFFICE_START_TIME) {
    //                 triggerPrompt("late");
    //             }
    //         }
    //     }
    //     else if (distance > GEOFENCE_RADIUS && insideGeofence) {
    //         console.log("inside Out dialouge")
    //         dispatch(setInsideGeofence(false));

    //         if (!hasExitedToday) {
    //             showToast("Exited Office");
    //             await AsyncStorage.setItem("hasExitedToday", "true");

    //             if (currentTime < OFFICE_END_TIME) {
    //                 triggerPrompt("early");
    //             }
    //         }
    //     }
    // };

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const Radius = 6371e3;
        const firstLat = (lat1 * Math.PI) / 180;
        const secondLat = (lat2 * Math.PI) / 180;
        const firstLong = ((lat2 - lat1) * Math.PI) / 180;
        const secondLong = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(firstLong / 2) * Math.sin(firstLong / 2) +
            Math.cos(firstLat) * Math.cos(secondLat) * Math.sin(secondLong / 2) * Math.sin(secondLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Radius * c;
    };

    const triggerPrompt = async (type: "late" | "early") => {
        const storageKey = type === "late" ? "lateReasonGiven" : "earlyReasonGiven";
        const reasonGiven = await AsyncStorage.getItem(storageKey);

        if (!reasonGiven) {
            setPromptType(type);
            setShowModal(true);
            await AsyncStorage.setItem(storageKey, "true");
        }
        await AsyncStorage.setItem(type === "late" ? "earlyReasonGiven" : "lateReasonGiven", "");
        await AsyncStorage.setItem(type === "late" ? "hasExitedToday" : "hasEnteredToday", "");
    };

    const submitReason = () => {
        console.log(`Reason for ${promptType}:`, reason);
        setShowModal(false);
        setReason("");
    };

    const showToast = (message: string) => {
        Toast.show({
            type: "info",
            position: "bottom",
            text1: message,
            visibilityTime: 3000,
        });
    };

    const resetDailyData = async () => {
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0];

        const lastResetDate = await AsyncStorage.getItem("lastResetDate");
        if (lastResetDate !== currentDate) {
            await AsyncStorage.multiRemove(["hasEnteredToday", "hasExitedToday", "lateReasonGiven", "earlyReasonGiven"]);
            await AsyncStorage.setItem("lastResetDate", currentDate);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Geofencing App</Text>
            <Toast />
            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
                        <Text>{promptType === "late" ? "Enter reason for late arrival:" : "Enter reason for early departure:"}</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 10 }}
                            placeholder="Type your reason..."
                            value={reason}
                            onChangeText={setReason}
                        />
                        <Button title="Submit" onPress={submitReason} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoginStatus;
