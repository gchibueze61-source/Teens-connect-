import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import "./Register.css";
import { supabase } from "../../lib/supabase";

interface LocationItem {
  name: string;
  isoCode: string;
  countryCode?: string;
}

const AFRICAN_COUNTRY_CODES = [
  "DZ", // Algeria
  "AO", // Angola
  "BJ", // Benin
  "BW", // Botswana
  "BF", // Burkina Faso
  "BI", // Burundi
  "CV", // Cabo Verde
  "CM", // Cameroon
  "CF", // Central African Republic
  "TD", // Chad
  "KM", // Comoros
  "CD", // Democratic Republic of the Congo
  "DJ", // Djibouti
  "EG", // Egypt
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "SZ", // Eswatini
  "ET", // Ethiopia
  "GA", // Gabon
  "GM", // Gambia
  "GH", // Ghana
  "GN", // Guinea
  "GW", // Guinea-Bissau
  "CI", // Ivory Coast
  "KE", // Kenya
  "LS", // Lesotho
  "LR", // Liberia
  "LY", // Libya
  "MG", // Madagascar
  "MW", // Malawi
  "ML", // Mali
  "MR", // Mauritania
  "MU", // Mauritius
  "MA", // Morocco
  "MZ", // Mozambique
  "NA", // Namibia
  "NE", // Niger
  "NG", // Nigeria
  "CG", // Republic of the Congo
  "RW", // Rwanda
  "ST", // Sao Tome and Principe
  "SN", // Senegal
  "SC", // Seychelles
  "SL", // Sierra Leone
  "SO", // Somalia
  "ZA", // South Africa
  "SS", // South Sudan
  "SD", // Sudan
  "TZ", // Tanzania
  "TG", // Togo
  "TN", // Tunisia
  "UG", // Uganda
  "ZM", // Zambia
  "ZW", // Zimbabwe
];

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    location: "",
    school: "",
    interests: "",
    bio: "",
  });

  const [profileImage, setProfileImage] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [selectedCountryCode, setSelectedCountryCode] =
    useState("");

  const [selectedStateCode, setSelectedStateCode] =
    useState("");

  const [states, setStates] = useState<LocationItem[]>([]);

  const [cities, setCities] = useState<LocationItem[]>([]);

  /*
   * ------------------------------------------------
   * AFRICAN COUNTRIES
   * ------------------------------------------------
   */

  const africanCountries = useMemo(() => {
    return Country.getAllCountries()
      .filter((country) =>
        AFRICAN_COUNTRY_CODES.includes(
          country.isoCode
        )
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, []);

  /*
   * ------------------------------------------------
   * LOAD STATES WHEN COUNTRY CHANGES
   * ------------------------------------------------
   */

  useEffect(() => {
    if (!selectedCountryCode) {
      setStates([]);
      setCities([]);
      return;
    }

    const countryStates =
      State.getStatesOfCountry(
        selectedCountryCode
      );

    setStates(countryStates);

    setCities([]);
  }, [selectedCountryCode]);

  /*
   * ------------------------------------------------
   * LOAD CITIES WHEN STATE CHANGES
   * ------------------------------------------------
   */

  useEffect(() => {
    if (
      !selectedCountryCode ||
      !selectedStateCode
    ) {
      setCities([]);
      return;
    }

    const stateCities =
      City.getCitiesOfState(
        selectedCountryCode,
        selectedStateCode
      );

    setCities(stateCities);
  }, [
    selectedCountryCode,
    selectedStateCode,
  ]);

  /*
   * ------------------------------------------------
   * HANDLE TEXT INPUTS
   * ------------------------------------------------
   */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  /*
   * ------------------------------------------------
   * COUNTRY CHANGE
   * ------------------------------------------------
   */

  const handleCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const countryCode = e.target.value;

    const country = africanCountries.find(
      (item) =>
        item.isoCode === countryCode
    );

    setSelectedCountryCode(countryCode);

    setSelectedStateCode("");

    setFormData((previous) => ({
      ...previous,
      country: country?.name || "",
      state: "",
      city: "",
      location: country?.name || "",
    }));
  };

  /*
   * ------------------------------------------------
   * STATE CHANGE
   * ------------------------------------------------
   */

  const handleStateChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const stateCode = e.target.value;

    const selectedState = states.find(
      (item) =>
        item.isoCode === stateCode
    );

    setSelectedStateCode(stateCode);

    setFormData((previous) => ({
      ...previous,
      state: selectedState?.name || "",
      city: "",
      location: [
        selectedState?.name,
        previous.country,
      ]
        .filter(Boolean)
        .join(", "),
    }));
  };

  /*
   * ------------------------------------------------
   * CITY CHANGE
   * ------------------------------------------------
   */

  const handleCityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const cityName = e.target.value;

    setFormData((previous) => ({
      ...previous,
      city: cityName,
      location: [
        cityName,
        previous.state,
        previous.country,
      ]
        .filter(Boolean)
        .join(", "),
    }));
  };

  /*
   * ------------------------------------------------
   * SUBMIT REGISTRATION
   * ------------------------------------------------
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const fullName =
        formData.full_name.trim();

      const email =
        formData.email.trim().toLowerCase();

      const password =
        formData.password;

      const country =
        formData.country.trim();

      const state =
        formData.state.trim();

      const city =
        formData.city.trim();

      if (!fullName) {
        throw new Error(
          "Please enter your full name."
        );
      }

      if (!email) {
        throw new Error(
          "Please enter your email address."
        );
      }

      if (password.length < 6) {
        throw new Error(
          "Password must be at least 6 characters."
        );
      }

      if (!country) {
        throw new Error(
          "Please select your country."
        );
      }

      if (!state) {
        throw new Error(
          "Please select your state or region."
        );
      }

      if (!city) {
        throw new Error(
          "Please select your city or town."
        );
      }

      /*
       * ------------------------------------------------
       * CHECK WHETHER MEMBERSHIP ALREADY EXISTS
       * ------------------------------------------------
       */

      const {
        data: existingMembership,
        error: membershipCheckError,
      } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", email)
        .maybeSingle();

      if (membershipCheckError) {
        throw membershipCheckError;
      }

      /*
       * ------------------------------------------------
       * IF MEMBER ALREADY HAS AN AUTH ACCOUNT
       * ------------------------------------------------
       */

      if (
        existingMembership &&
        existingMembership.auth_user_id
      ) {
        setMessage(
          "An account already exists with this email address. Please log in instead."
        );

        setMessageType("error");
        return;
      }

      /*
       * ------------------------------------------------
       * CREATE AUTH ACCOUNT
       * ------------------------------------------------
       */

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error(
          "Your account could not be created."
        );
      }

      const authUserId =
        authData.user.id;

      let profileImageUrl: string | null =
        null;

      /*
       * ------------------------------------------------
       * UPLOAD PROFILE IMAGE
       * ------------------------------------------------
       */

      if (profileImage) {
        if (profileImage.size > 5 * 1024 * 1024) {
          throw new Error(
            "Profile image must be 5MB or smaller."
          );
        }

        const fileExt =
          profileImage.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const fileName =
          `${authUserId}.${fileExt}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("profile-images")
          .upload(
            fileName,
            profileImage,
            {
              upsert: true,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: imageData,
        } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        profileImageUrl =
          imageData.publicUrl;
      }

      /*
       * ------------------------------------------------
       * BUILD LOCATION
       * ------------------------------------------------
       */

      const location = [
        city,
        state,
        country,
      ]
        .filter(Boolean)
        .join(", ");

      /*
       * ------------------------------------------------
       * ADMIN ALREADY ADDED THIS MEMBER
       * ------------------------------------------------
       */

      if (existingMembership) {
        const {
          error: updateError,
        } = await supabase
          .from("profiles")
          .update({
            auth_user_id: authUserId,

            full_name: fullName,

            email,

            phone:
              formData.phone.trim() ||
              existingMembership.phone ||
              null,

            country:
              country ||
              existingMembership.country ||
              null,

            state:
              state ||
              existingMembership.state ||
              null,

            city:
              city ||
              existingMembership.city ||
              null,

            location:
              location ||
              existingMembership.location ||
              null,

            school:
              formData.school.trim() ||
              existingMembership.school ||
              null,

            interests:
              formData.interests.trim() ||
              existingMembership.interests ||
              null,

            bio:
              formData.bio.trim() ||
              existingMembership.bio ||
              null,

            profile_image_url:
              profileImageUrl ||
              existingMembership.profile_image_url ||
              null,

            role: "member",

            status: "active",

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            existingMembership.id
          );

        if (updateError) {
          throw updateError;
        }

        setMessage(
          "Registration successful! Your existing Teens Connect Africa membership has been activated."
        );

        setMessageType("success");

        setTimeout(() => {
          navigate("/login");
        }, 2000);

        return;
      }

      /*
       * ------------------------------------------------
       * COMPLETELY NEW MEMBER
       * ------------------------------------------------
       */

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .insert({
          id: authUserId,

          auth_user_id: authUserId,

          full_name: fullName,

          email,

          phone:
            formData.phone.trim() ||
            null,

          country:
            country || null,

          state:
            state || null,

          city:
            city || null,

          location:
            location || null,

          school:
            formData.school.trim() ||
            null,

          interests:
            formData.interests.trim() ||
            null,

          bio:
            formData.bio.trim() ||
            null,

          profile_image_url:
            profileImageUrl,

          role: "member",

          status: "active",
        });

      if (profileError) {
        throw profileError;
      }

      /*
       * ------------------------------------------------
       * SUCCESS
       * ------------------------------------------------
       */

      setMessage(
        "Registration successful! Your Teens Connect Africa account has been created."
      );

      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error: any) {
      console.error(
        "REGISTRATION ERROR:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong during registration."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-card">

          {/* HEADER */}

          <div className="register-header">

            <div className="register-logo">

              <img
                src="/logo/bobdaddy%202%201580.jpg"
                alt="Teens Connect Africa"
              />

            </div>

            <h1>
              Join Teens Connect Africa
            </h1>

            <p>
              Create your account and become
              part of our community.
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}

            <div className="register-field">

              <label htmlFor="full_name">
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />

            </div>


            {/* EMAIL */}

            <div className="register-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create your password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <small>
                Create a password for your
                account. At least 6 characters.
              </small>

            </div>


            {/* PHONE */}

            <div className="register-field">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>


            {/* COUNTRY */}

            <div className="register-field">

              <label htmlFor="country">
                Country
              </label>

              <select
                id="country"
                name="country"
                value={selectedCountryCode}
                onChange={handleCountryChange}
                required
              >

                <option value="">
                  Select your country
                </option>

                {africanCountries.map(
                  (country) => (
                    <option
                      key={country.isoCode}
                      value={country.isoCode}
                    >
                      {country.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* STATE / REGION */}

            <div className="register-field">

              <label htmlFor="state">
                State / Province / Region
              </label>

              {states.length > 0 ? (

                <select
                  id="state"
                  name="state"
                  value={selectedStateCode}
                  onChange={handleStateChange}
                  required
                  disabled={!selectedCountryCode}
                >

                  <option value="">
                    Select your state / region
                  </option>

                  {states.map(
                    (state) => (
                      <option
                        key={state.isoCode}
                        value={state.isoCode}
                      >
                        {state.name}
                      </option>
                    )
                  )}

                </select>

              ) : (

                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder={
                    selectedCountryCode
                      ? "Enter your state / region"
                      : "Select your country first"
                  }
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!selectedCountryCode}
                  required
                />

              )}

            </div>


            {/* CITY */}

            <div className="register-field">

              <label htmlFor="city">
                City / Town
              </label>

              {cities.length > 0 ? (

                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  required
                  disabled={!selectedStateCode}
                >

                  <option value="">
                    Select your city / town
                  </option>

                  {cities.map(
                    (city, index) => (
                      <option
                        key={`${city.name}-${index}`}
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    )
                  )}

                </select>

              ) : (

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder={
                    selectedStateCode
                      ? "Enter your city / town"
                      : "Select your state / region first"
                  }
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!selectedCountryCode}
                  required
                />

              )}

            </div>


            {/* LOCATION PREVIEW */}

            {formData.location && (
              <div className="register-field">

                <label>
                  Your Location
                </label>

                <input
                  type="text"
                  value={formData.location}
                  readOnly
                />

              </div>
            )}


            {/* SCHOOL */}

            <div className="register-field">

              <label htmlFor="school">
                School
              </label>

              <input
                id="school"
                name="school"
                type="text"
                placeholder="Enter your school"
                value={formData.school}
                onChange={handleChange}
                required
              />

            </div>


            {/* INTERESTS */}

            <div className="register-field">

              <label htmlFor="interests">
                Interests
              </label>

              <input
                id="interests"
                name="interests"
                type="text"
                placeholder="e.g. Technology, Business, Writing"
                value={formData.interests}
                onChange={handleChange}
                required
              />

            </div>


            {/* BIO */}

            <div className="register-field">

              <label htmlFor="bio">
                Tell us about yourself
              </label>

              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />

            </div>


            {/* PROFILE IMAGE */}

            <div className="register-field">

              <label htmlFor="profileImage">

                Profile Image

                <span>
                  {" "} (Optional)
                </span>

              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfileImage(
                    e.target.files?.[0] ||
                    null
                  )
                }
              />

              <small>
                Maximum file size: 5MB
              </small>

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={`register-message ${
                  messageType === "success"
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Join Community"}
            </button>

          </form>


          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          </div>


          {/* HOME */}

          <button
            type="button"
            className="register-home"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to website
          </button>

        </div>

      </div>

    </main>
  );
};

export default Register;