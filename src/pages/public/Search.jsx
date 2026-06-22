import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosPublic from "../../api/axiosPublic";
import BloodBadge from "../../components/common/BloodBadge";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import useLocationData from "../../hooks/useLocationData";
import { BLOOD_GROUPS, DEFAULT_AVATAR } from "../../utils/constants";

const Search = () => {
  const { districts, getUpazilasByDistrict, loading: locationLoading } =
    useLocationData();

  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const selectedDistrict = useMemo(
    () => districts.find((item) => item.name === district),
    [districts, district]
  );

  const upazilaOptions = useMemo(() => {
    if (!selectedDistrict?.id) return [];
    return getUpazilasByDistrict(selectedDistrict.id);
  }, [selectedDistrict, getUpazilasByDistrict]);

  const handleDistrictChange = (value) => {
    setDistrict(value);
    setUpazila("");
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!bloodGroup || !district || !upazila) {
      toast.error("Please select blood group, district and upazila.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data } = await axiosPublic.get("/api/users/search-donors", {
        params: {
          bloodGroup,
          district,
          upazila,
        },
      });

      setDonors(data?.donors || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to search donors."
      );
      setDonors([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="bg-surface-page py-10 sm:py-14">
      <div className="sc-container space-y-8">
        <div className="sc-card p-6 sm:p-8">
          <div className="flex items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
              <span className="material-symbols-rounded text-4xl">search</span>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Search Donors
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Find matching blood donors
              </h1>

              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
                Select blood group, district and upazila to search active donors.
                By default, no donor data is shown until you search.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="sc-card p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-4">
            <div>
              <label className="sc-label">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(event) => setBloodGroup(event.target.value)}
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
                value={district}
                onChange={(event) => handleDistrictChange(event.target.value)}
                disabled={locationLoading}
                className="sc-select mt-2"
                required
              >
                <option value="">
                  {locationLoading ? "Loading districts..." : "Select district"}
                </option>

                {districts.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="sc-label">Upazila</label>
              <select
                value={upazila}
                onChange={(event) => setUpazila(event.target.value)}
                disabled={!district || locationLoading}
                className="sc-select mt-2"
                required
              >
                <option value="">
                  {district ? "Select upazila" : "Select district first"}
                </option>

                {upazilaOptions.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="submit"
                icon="search"
                disabled={isSearching}
                className="w-full"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </form>

        <section className="sc-card overflow-hidden">
          <div className="border-b border-surface-border p-5 sm:p-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Search Results
            </h2>

            <p className="mt-1 text-sm font-semibold text-ink-muted">
              {hasSearched
                ? `${donors.length} matching donor found.`
                : "No donor data is shown before searching."}
            </p>
          </div>

          {isSearching ? (
            <div className="p-10">
              <Loader />
            </div>
          ) : !hasSearched ? (
            <EmptySearchState
              icon="manage_search"
              title="Search to view donors"
              description="Choose blood group, district and upazila, then click search."
            />
          ) : donors.length === 0 ? (
            <EmptySearchState
              icon="person_off"
              title="No matching donor found"
              description="Try a different blood group, district or upazila."
            />
          ) : (
            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
              {donors.map((donor) => (
                <DonorCard key={donor._id || donor.id || donor.email} donor={donor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

const DonorCard = ({ donor }) => {
  const avatar =
    donor.avatar || donor.image || donor.photoURL || DEFAULT_AVATAR;

  return (
    <article className="rounded-[28px] border border-surface-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={donor.name || "Donor avatar"}
            className="h-14 w-14 rounded-[20px] object-cover"
          />

          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-ink">
              {donor.name || "Scaffold Donor"}
            </h3>

            <p className="mt-1 text-xs font-semibold text-ink-muted">
              {donor.email}
            </p>
          </div>
        </div>

        <BloodBadge group={donor.bloodGroup} size="sm" />
      </div>

      <div className="mt-5 space-y-3">
        <DonorInfo icon="location_on" label="District" value={donor.district} />
        <DonorInfo icon="near_me" label="Upazila" value={donor.upazila} />
        <DonorInfo icon="verified" label="Status" value={donor.status || "active"} />
      </div>
    </article>
  );
};

const DonorInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-surface-soft p-3">
      <span className="material-symbols-rounded text-primary">{icon}</span>
      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value || "N/A"}</p>
      </div>
    </div>
  );
};

const EmptySearchState = ({ icon, title, description }) => {
  return (
    <div className="p-10 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded text-4xl">{icon}</span>
      </span>

      <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-ink-muted">
        {description}
      </p>
    </div>
  );
};

export default Search;