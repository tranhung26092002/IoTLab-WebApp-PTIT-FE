// data/hardDeviceData.ts
import { HardDevice } from '../types/hardDevice';

export const hardDevices: HardDevice[] = [
    {
        id: "hd-001",
        name: "Arduino Uno R3",
        type: "Microcontroller",
        brand: "Arduino",
        model: "Uno R3",
        status: "available",
        imageUrl: "/images/arduino-uno.jpg",
        specifications: {
            "Microcontroller": "ATmega328P",
            "Operating Voltage": "5V",
            "Digital I/O Pins": "14",
            "Analog Input Pins": "6",
            "Flash Memory": "32 KB"
        }
    },
    {
        id: "hd-002",
        name: "ESP32 DevKit",
        type: "WiFi Module",
        brand: "Espressif",
        model: "ESP32-WROOM",
        status: "borrowed",
        imageUrl: "/images/esp32.jpg",
        specifications: {
            "CPU": "Dual-Core 240MHz",
            "WiFi": "2.4 GHz",
            "Bluetooth": "BLE 4.2",
            "RAM": "520 KB",
            "Flash": "4 MB"
        }
    },
    {
        id: "hd-003",
        name: "Raspberry Pi 4",
        type: "Single Board Computer",
        brand: "Raspberry Pi",
        model: "4 Model B",
        status: "available",
        imageUrl: "/images/raspberry-pi-4.jpg",
        specifications: {
            "Processor": "Quad Core Cortex-A72",
            "RAM": "4GB",
            "WiFi": "2.4GHz/5GHz",
            "Bluetooth": "5.0",
            "USB Ports": "4"
        }
    },
    {
        id: "hd-004",
        name: "NodeMCU",
        type: "WiFi Module",
        brand: "ESP8266",
        model: "ESP-12E",
        status: "available",
        imageUrl: "/images/nodemcu.jpg",
        specifications: {
            "CPU": "80MHz",
            "Flash Memory": "4MB",
            "USB-TTL": "CH340G",
            "WiFi": "2.4 GHz",
            "GPIO Pins": "11"
        }
    },
    {
        id: "hd-005",
        name: "Arduino Mega",
        type: "Microcontroller",
        brand: "Arduino",
        model: "Mega 2560",
        status: "borrowed",
        imageUrl: "/images/arduino-mega.jpg",
        specifications: {
            "Microcontroller": "ATmega2560",
            "Operating Voltage": "5V",
            "Digital I/O Pins": "54",
            "Analog Input Pins": "16",
            "Flash Memory": "256 KB"
        }
    },
    {
        id: "hd-006",
        name: "ESP32-CAM",
        type: "Camera Module",
        brand: "Espressif",
        model: "AI-Thinker",
        status: "available",
        imageUrl: "/images/esp32-cam.jpg",
        specifications: {
            "Camera": "OV2640 2MP",
            "WiFi": "2.4 GHz",
            "Bluetooth": "BLE 4.2",
            "Flash Memory": "4MB",
            "PSRAM": "8MB"
        }
    }
];