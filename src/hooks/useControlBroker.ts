import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

type QoS = 0 | 1 | 2;

interface UseControlBrokerProps {
  deviceId: string;
  onMessage?: (topic: string, payload: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface BrokerConfig {
  address: string;
  port: string;
  username?: string;
  password?: string;
  protocol?: 'ws' | 'wss';
  path?: string;
  clientId?: string;
  keepalive?: number;
  reconnectPeriod?: number;
  connectTimeout?: number;
}

interface SubscribedTopic {
  topic: string;
  qos: QoS;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useControlBroker = ({ 
  deviceId, 
  onMessage,
  onConnect,
  onDisconnect,
  onError 
}: UseControlBrokerProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [subscribedTopics, setSubscribedTopics] = useState<SubscribedTopic[]>([]);
  const [lastError, setLastError] = useState<Error | null>(null);

  const connectBroker = useCallback((config: BrokerConfig) => {
    try {
      if (client) {
        client.end();
      }

      const protocol = config.protocol || 'ws';
      const path = config.path || '/mqtt';
      const url = `${protocol}://${config.address}:${config.port}${path}`;

      const options: IClientOptions = {
        username: config.username,
        password: config.password,
        clientId: config.clientId || `web_${deviceId}_${Math.random().toString(16).substr(2, 8)}`,
        clean: true,
        keepalive: config.keepalive || 60,
        reconnectPeriod: config.reconnectPeriod || 1000,
        connectTimeout: config.connectTimeout || 4000,
        rejectUnauthorized: protocol === 'wss'
      };

      setConnectionStatus('connecting');
      const newClient = mqtt.connect(url, options);

      newClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        setConnectionStatus('connected');
        setLastError(null);
        onConnect?.();
      });

      newClient.on('message', (topic: string, message: Buffer) => {
        try {
          const payload = message.toString();
          console.log('Received message:', { topic, payload });
          onMessage?.(topic, payload);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      newClient.on('error', (err: Error) => {
        console.error('MQTT Error:', err);
        setConnectionStatus('error');
        setLastError(err);
        onError?.(err);
      });

      newClient.on('close', () => {
        console.log('Disconnected from MQTT broker');
        setConnectionStatus('disconnected');
        onDisconnect?.();
      });

      newClient.on('reconnect', () => {
        console.log('Attempting to reconnect...');
        setConnectionStatus('connecting');
      });

      setClient(newClient);
    } catch (error) {
      console.error('Error creating MQTT client:', error);
      setConnectionStatus('error');
      setLastError(error as Error);
      onError?.(error as Error);
    }
  }, [client, deviceId, onMessage, onConnect, onDisconnect, onError]);

  const publishMessage = useCallback((topic: string, message: string, qos: QoS = 0) => {
    if (!client || connectionStatus !== 'connected') {
      const error = new Error('Not connected to broker');
      console.error(error);
      onError?.(error);
      return;
    }

    try {
      client.publish(topic, message, { qos }, (err) => {
        if (err) {
          console.error('Error publishing message:', err);
          onError?.(err);
        } else {
          console.log('Message published successfully:', { topic, message, qos });
        }
      });
    } catch (error) {
      console.error('Error in publishMessage:', error);
      onError?.(error as Error);
    }
  }, [client, connectionStatus, onError]);

  const subscribeToTopic = useCallback((topic: string, qos: QoS = 0) => {
    if (!client || connectionStatus !== 'connected') {
      const error = new Error('Not connected to broker');
      console.error(error);
      onError?.(error);
      return;
    }

    try {
      client.subscribe(topic, { qos }, (err) => {
        if (err) {
          console.error('Error subscribing to topic:', err);
          onError?.(err);
        } else {
          console.log('Subscribed to topic:', { topic, qos });
          setSubscribedTopics(prev => [...prev, { topic, qos }]);
        }
      });
    } catch (error) {
      console.error('Error in subscribeToTopic:', error);
      onError?.(error as Error);
    }
  }, [client, connectionStatus, onError]);

  const unsubscribeFromTopic = useCallback((topic: string) => {
    if (!client || connectionStatus !== 'connected') {
      const error = new Error('Not connected to broker');
      console.error(error);
      onError?.(error);
      return;
    }

    try {
      client.unsubscribe(topic, (err) => {
        if (err) {
          console.error('Error unsubscribing from topic:', err);
          onError?.(err);
        } else {
          console.log('Unsubscribed from topic:', topic);
          setSubscribedTopics(prev => prev.filter(t => t.topic !== topic));
        }
      });
    } catch (error) {
      console.error('Error in unsubscribeFromTopic:', error);
      onError?.(error as Error);
    }
  }, [client, connectionStatus, onError]);

  const disconnect = useCallback(() => {
    if (client) {
      try {
        client.end();
        setClient(null);
        setConnectionStatus('disconnected');
        setSubscribedTopics([]);
        setLastError(null);
      } catch (error) {
        console.error('Error disconnecting:', error);
        onError?.(error as Error);
      }
    }
  }, [client, onError]);

  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    subscribedTopics,
    lastError,
    publishMessage,
    subscribeToTopic,
    unsubscribeFromTopic,
    connectBroker,
    disconnect
  };
}; 