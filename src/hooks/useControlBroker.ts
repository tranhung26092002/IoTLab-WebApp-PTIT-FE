import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient } from 'mqtt';

type QoS = 0 | 1 | 2;

interface UseControlBrokerProps {
  deviceId: string;
  onMessage?: (topic: string, payload: string) => void;
}

interface BrokerConfig {
  address: string;
  port: string;
  username: string;
  password: string;
}

interface SubscribedTopic {
  topic: string;
  qos: QoS;
}

export const useControlBroker = ({ deviceId, onMessage }: UseControlBrokerProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [subscribedTopics, setSubscribedTopics] = useState<SubscribedTopic[]>([]);

  const connectBroker = useCallback((config: BrokerConfig) => {
    if (client) {
      client.end();
    }

    // Connect directly to MQTT broker using WebSocket
    const url = `ws://${config.address}:${config.port}/mqtt`;
    const options = {
      username: config.username || undefined,
      password: config.password || undefined,
      clientId: `web_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 4000
    };

    const newClient = mqtt.connect(url, options);

    newClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      setIsConnected(true);
    });

    newClient.on('message', (topic: string, message: Buffer) => {
      const payload = message.toString();
      console.log('Received message:', { topic, payload });
      onMessage?.(topic, payload);
    });

    newClient.on('error', (err: Error) => {
      console.error('MQTT Error:', err);
      setIsConnected(false);
    });

    newClient.on('close', () => {
      console.log('Disconnected from MQTT broker');
      setIsConnected(false);
    });

    setClient(newClient);
  }, [client, onMessage]);

  const publishMessage = useCallback((topic: string, message: string, qos: QoS = 0) => {
    if (!client || !isConnected) {
      console.error('Not connected to broker');
      return;
    }

    client.publish(topic, message, { qos }, (err) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log('Message published successfully:', { topic, message, qos });
      }
    });
  }, [client, isConnected]);

  const subscribeToTopic = useCallback((topic: string, qos: QoS = 0) => {
    if (!client || !isConnected) {
      console.error('Not connected to broker');
      return;
    }

    client.subscribe(topic, { qos }, (err) => {
      if (err) {
        console.error('Error subscribing to topic:', err);
      } else {
        console.log('Subscribed to topic:', { topic, qos });
        setSubscribedTopics(prev => [...prev, { topic, qos }]);
      }
    });
  }, [client, isConnected]);

  const unsubscribeFromTopic = useCallback((topic: string) => {
    if (!client || !isConnected) {
      console.error('Not connected to broker');
      return;
    }

    client.unsubscribe(topic, (err) => {
      if (err) {
        console.error('Error unsubscribing from topic:', err);
      } else {
        console.log('Unsubscribed from topic:', topic);
        setSubscribedTopics(prev => prev.filter(t => t.topic !== topic));
      }
    });
  }, [client, isConnected]);

  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setIsConnected(false);
      setSubscribedTopics([]);
    }
  }, [client]);

  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return {
    isConnected,
    subscribedTopics,
    publishMessage,
    subscribeToTopic,
    unsubscribeFromTopic,
    connectBroker,
    disconnect
  };
}; 