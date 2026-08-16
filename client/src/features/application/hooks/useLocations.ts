import { useState, useEffect } from 'react';

export function useLocations(
  regionName: string,
  provinceName: string,
  cityName: string
) {
  const [regions, setRegions] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [barangays, setBarangays] = useState<any[]>([]);

  // Fetch Regions
  useEffect(() => {
    fetch('/api/locations/regions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRegions(data);
        else setRegions([]);
      })
      .catch(err => {
        console.error(err);
        setRegions([]);
      });
  }, []);

  // Fetch Provinces
  useEffect(() => {
    const region = regions.find(r => r.name === regionName);
    if (region) {
      fetch(`/api/locations/provinces?regionCode=${region.code}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setProvinces(data);
          else setProvinces([]);
        })
        .catch(err => {
          console.error(err);
          setProvinces([]);
        });
    } else {
      setProvinces([]);
    }
  }, [regionName, regions]);

  // Fetch Cities
  useEffect(() => {
    const region = regions.find(r => r.name === regionName);
    const province = provinces.find(p => p.name === provinceName);
    
    if (region) {
      let url = `/api/locations/cities?regionCode=${region.code}`;
      if (province) {
        url += `&provinceCode=${province.code}`;
      }
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCities(data);
          else setCities([]);
        })
        .catch(err => {
          console.error(err);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  }, [regionName, provinceName, regions, provinces]);

  // Fetch Barangays
  useEffect(() => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      fetch(`/api/locations/barangays?cityCode=${city.code}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBarangays(data);
          else setBarangays([]);
        })
        .catch(err => {
          console.error(err);
          setBarangays([]);
        });
    } else {
      setBarangays([]);
    }
  }, [cityName, cities]);

  return { regions, provinces, cities, barangays };
}
