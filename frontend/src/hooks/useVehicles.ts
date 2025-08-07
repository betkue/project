import { Vehicle } from '@/type/vehicle';
import { api } from '@/utils';
import { useEffect, useState } from 'react';



export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/vehicles`)
      .then(res => res.json())
      .then(json => {
        setVehicles(json);
        setLoading(false);
      });
  }, []);

  return { vehicles, loading,setVehicles };
}

export function useVehicle(id:string) {
  const [vehicle, setData] = useState<Vehicle|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/vehicles/${id}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return { vehicle, loading };
}


export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle | null> {
  try {
    const res = await fetch(`${api}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create vehicle');
    return await res.json();
  } catch (err) {
    console.error('Create error:', err);
    return null;
  }
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
  try {
    const res = await fetch(`${api}/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update vehicle');
    return await res.json();
  } catch (err) {
    console.error('Update error:', err);
    return null;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${api}/vehicles/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete vehicle');
    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}

