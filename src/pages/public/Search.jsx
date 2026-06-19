import { useMemo, useState } from "react";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { donorMockData } from "../../data/donorMockData";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS } from "../../utils/constants";
import { formatDate } from "../../utils/dateFormatter";

const Search = () => {
  const { districts, loading, getUpazilasByDistrict } = useLocationData();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    districtId: "",
    upazilaId: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);

  const filteredUpazilas = useMemo(
    () => getUpazilasByDistrict(formData.districtId),
    [formData.districtId, getUpazilasByDistrict]
  );

  const selectedDistrict = districts.find(
    (district) => String(district.id) === String(formData.districtId)
  );

  const selectedUpazila = filteredUpazilas.find(
    (upazila) => String(upazila.id) === String(formData.upazilaId)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
      ...(name === "districtId" ? { upazilaId: "" } : {}),
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const districtName = selectedDistrict?.name || "";
    const upazilaName = selectedUpazila?.name || "";

    const matchedDonors = donorMockData.filter((donor) => {
      const isBloodMatch = donor.bloodGroup === formData.bloodGroup;
      const isDistrictMatch = donor.district === districtName;
      const isUpazilaMatch = donor.upazila === upazilaName;
      const isActive = donor.status === "active";

      return isBloodMatch && isDistrictMatch && isUpazilaMatch && isActive;
    });

    setResults(matchedDonors);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFormData({
      bloodGroup: "",
      districtId: "",
      upazilaId: "",
    });

    setResults([]);
    setHasSearched(false);
  };

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-6">
        <PageHeader
          eyebrow="Search Donors"
          title="Search available blood donors"
          description="Select blood group, district and upazila, then click search to find matching active donors."
          icon="search"
        />

        <form onSubmit={handleSearch} className="sc-card p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label className="sc-label">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="sc-select mt-2"
                required
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sc-label">District</label>
              <select
                name="districtId"
                value={formData.districtId}
                onChange={handleChange}
                className="sc-select mt-2"
                disabled={loading}
                required
              >
                <option value="">
                  {loading ? "Loading districts..." : "Select district"}
                </option>

                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sc-label">Upazila</label>
              <select
                name="upazilaId"
                value={formData.upazilaId}
                onChange={handleChange}
                className="sc-select mt-2"
                disabled={!formData.districtId || loading}
                required
              >
                <option value="">
                  {!formData.districtId
                    ? "Select district first"
                    : "Select upazila"}
                </option>

                {filteredUpazilas.map((upazila) => (
                  <option key={upazila.id} value={upazila.id}>
                    {upazila.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" icon="search">
                Search
              </Button>

              <Button
                type="button"
                variant="secondary"
                icon="restart_alt"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>

        {!hasSearched ? (
          <EmptyState
            icon="manage_search"
            title="Search to view donor results"
            description="By default this page does not show donor data. Fill the search form and click the search button to view matching donors."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon="person_search"
            title="No matching donor found"
            description="No active donor matched your selected blood group, district and upazila."
          />
        ) : (
          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink">
                  Search Results
                </h2>
                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  Matching active donors based on your selected location and
                  blood group.
                </p>
              </div>

              <StatusBadge status="active" label={`${results.length} Donors`} />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {results.map((donor) => (
                <article key={donor.id} className="sc-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary-tint text-primary">
                        <span className="material-symbols-rounded text-3xl">
                          person
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-ink">
                          {donor.name}
                        </h3>
                        <p className="text-xs font-semibold text-ink-muted">
                          {donor.email}
                        </p>
                      </div>
                    </div>

                    <BloodBadge group={donor.bloodGroup} size="sm" />
                  </div>

                  <div className="mt-5 space-y-3">
                    <InfoRow
                      icon="location_on"
                      label="Location"
                      value={`${donor.district}, ${donor.upazila}`}
                    />

                    <InfoRow icon="call" label="Phone" value={donor.phone} />

                    <InfoRow
                      icon="event_available"
                      label="Last Donation"
                      value={formatDate(donor.lastDonationDate)}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-[22px] border border-surface-border bg-surface-soft p-4">
                    <p className="text-sm font-extrabold text-ink-muted">
                      Donor Status
                    </p>
                    <StatusBadge status={donor.status} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded text-xl">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default Search;