import { useState, useEffect } from 'react';
import { HardDevice, FilterParams } from '../types/hardDevice';
import { hardDevices } from '../data/hardDeviceData';

export const useHardDevices = (filters: FilterParams) => {
    const [devices, setDevices] = useState<HardDevice[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const filterDevices = () => {
            setLoading(true);
            try {
                let filteredDevices = [...hardDevices];

                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    filteredDevices = filteredDevices.filter(device =>
                        device.name.toLowerCase().includes(searchLower) ||
                        device.brand.toLowerCase().includes(searchLower) ||
                        device.model.toLowerCase().includes(searchLower)
                    );
                }

                if (filters.type) {
                    filteredDevices = filteredDevices.filter(device =>
                        device.type === filters.type
                    );
                }

                setDevices(filteredDevices);
            } finally {
                setLoading(false);
            }
        };

        filterDevices();
    }, [filters]);

    return { devices, loading };
};