/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/utils';
import { useEffect, useState } from 'react';

export function useFleetEfficiency() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/analytics/fleet-efficiency`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

export function useFleetComposition() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/analytics/fleet-composition`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}

export function useFleetOperational() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${api}/analytics/fleet-operational`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
