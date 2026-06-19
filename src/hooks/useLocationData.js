import { useEffect, useMemo, useState } from "react";
import { DISTRICT_DATA_PATH, UPAZILA_DATA_PATH } from "../utils/constants";

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

        const districtData = await districtResponse.json();
        const upazilaData = await upazilaResponse.json();

        setDistricts(districtData?.districts || districtData || []);
        setUpazilas(upazilaData?.upazilas || upazilaData || []);
      } catch {
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
      (upazila) =>
        String(upazila.district_id) === String(districtId) ||
        String(upazila.districtId) === String(districtId)
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