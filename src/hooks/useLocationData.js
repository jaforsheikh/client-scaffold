import { useEffect, useMemo, useState } from "react";
import { DISTRICT_DATA_PATH, UPAZILA_DATA_PATH } from "../utils/constants";

const collectRows = (payload, rowType) => {
  const rows = [];

  const walk = (value) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (value && typeof value === "object") {
      const isDistrictRow =
        rowType === "district" &&
        value.id &&
        value.name &&
        value.division_id;

      const isUpazilaRow =
        rowType === "upazila" &&
        value.id &&
        value.name &&
        value.district_id;

      if (isDistrictRow || isUpazilaRow) {
        rows.push(value);
        return;
      }

      Object.values(value).forEach(walk);
    }
  };

  walk(payload);

  return rows;
};

const normalizeDistricts = (districts) => {
  return districts
    .map((district) => ({
      id: String(district.id),
      division_id: String(district.division_id),
      name: district.name,
      bn_name: district.bn_name || "",
      lat: district.lat || "",
      lon: district.lon || "",
      url: district.url || "",
    }))
    .filter((district) => district.id && district.name && district.division_id)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const normalizeUpazilas = (upazilas) => {
  return upazilas
    .map((upazila) => ({
      id: String(upazila.id),
      district_id: String(upazila.district_id),
      name: upazila.name,
      bn_name: upazila.bn_name || "",
      url: upazila.url || "",
    }))
    .filter((upazila) => upazila.id && upazila.name && upazila.district_id)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const useLocationData = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocationData = async () => {
      setLoading(true);

      try {
        const [districtResponse, upazilaResponse] = await Promise.all([
          fetch(DISTRICT_DATA_PATH),
          fetch(UPAZILA_DATA_PATH),
        ]);

        if (!districtResponse.ok || !upazilaResponse.ok) {
          throw new Error("Bangladesh location JSON file not found.");
        }

        const districtPayload = await districtResponse.json();
        const upazilaPayload = await upazilaResponse.json();

        const districtRows = collectRows(districtPayload, "district");
        const upazilaRows = collectRows(upazilaPayload, "upazila");

        setDistricts(normalizeDistricts(districtRows));
        setUpazilas(normalizeUpazilas(upazilaRows));
      } catch (error) {
        console.error("Failed to load Bangladesh location data:", error);
        setDistricts([]);
        setUpazilas([]);
      } finally {
        setLoading(false);
      }
    };

    loadLocationData();
  }, []);

  const getUpazilasByDistrict = (districtId) => {
    if (!districtId) return [];

    return upazilas.filter(
      (upazila) => String(upazila.district_id) === String(districtId)
    );
  };

  const locationInfo = useMemo(
    () => ({
      districts,
      upazilas,
      loading,
      getUpazilasByDistrict,
    }),
    [districts, upazilas, loading]
  );

  return locationInfo;
};

export default useLocationData;