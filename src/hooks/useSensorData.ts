import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { DeviceCommand, SensorData } from "../types/deviceData";
import { API_BASE_URL } from '../config/env';

export const useSensorData = (id: string) => {
    const stompClientRef = useRef<Client | null>(null);
    const [sensorData, setSensorData] = useState<SensorData>({
        id: 0,
        temperature: 0,
        humidity: 0,
        light: 0,
        gas: 0,
        alertLed: 0,
        buzzer: 0,
        led: 0,
        fan: 0,
        servo: 0,
        broker: '',
        topic: '',
        payload: '',
        createdAt: []
    });

    useEffect(() => {
        const sock = new SockJS(`${API_BASE_URL}/mqtt/ws`);
        const stompClient = new Client({
            webSocketFactory: () => sock,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClientRef.current = stompClient;

        stompClient.onConnect = () => {
            console.log("WebSocket connected");

            stompClient.subscribe(`/topic/sensorData/${id}`, (message) => {
                const data = JSON.parse(message.body);
                setSensorData(data);
            });

            fetchInitialData();
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [id]);

    const fetchInitialData = () => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: `/app/device/${id}`,
                body: JSON.stringify({ id }),
            });
        }
    };

    const publishCommand = (command: DeviceCommand) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({
                destination: `/app/publish/command/${id}`,
                body: JSON.stringify(command),
            });
        }
    };

    const toggleDevice = (device: keyof Pick<SensorData, 'led' | 'buzzer' | 'alertLed' | 'servo' | 'fan'>) => {
        const newStatus = sensorData[device] === 0 ? 1 : 0;
        const command: DeviceCommand = {
            deviceName: `node_${id}`,
            [device]: newStatus,
        };
        console.log("Toggling", device, "to", newStatus);
        console.log("Command", command);

        setSensorData(prev => ({
            ...prev,
            [device]: newStatus
        }));

        publishCommand(command);
    };

    return {
        sensorData: {
            data: sensorData ,
            sensors: {
                temperature: sensorData.temperature,
                humidity: sensorData.humidity,
                light: sensorData.light,
                gas: sensorData.gas
            },
            status: {
                led: sensorData.led,
                buzzer: sensorData.buzzer,
                fan: sensorData.fan,
                alert_led: sensorData.alertLed,
                servo: sensorData.servo
            }
        },
        toggleLed: () => toggleDevice('led'),
        toggleBuzzer: () => toggleDevice('buzzer'),
        toggleFan: () => toggleDevice('fan'),
        toggleAlertLed: () => toggleDevice('alertLed'),
        toggleServo: () => toggleDevice('servo'),
    };
};