import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Country,
  State,
  City,
} from "country-state-city";
import "./Register.css";
import { supabase } from "../../lib/supabase";

interface LocationItem {
  name: string;
  isoCode: string;
  countryCode?: string;
}

const AFRICAN_COUNTRY_CODES = [
  "DZ",
  "AO",
  "BJ",
  "BW",
  "BF",
  "BI",
  "CV",
  "CM",
  "CF",
  "TD",
  "KM",
  "CD",
  "DJ",
  "EG",
  "GQ",
  "ER",
  "SZ",
  "ET",
  "GA",
  "GM",
  "GH",
  "GN",
  "GW",
  "CI",
  "KE",
  "LS",
  "LR",
  "LY",
  "MG",
  "MW",
  "ML",
  "MR",
  "MU",
  "MA",
  "MZ",
  "NA",
  "NE",
  "NG",
  "CG",
  "RW",
  "ST",
  "SN",
  "SC",
  "SL",
  "SO",
  "ZA",
  "SS",
  "SD",
  "TZ",
  "TG",
  "TN",
  "UG",
  "ZM",
  "ZW",
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
    lga: "",
    city: "",
    community: "",
    address: "",
    location: "",
    school: "",
    interests: "",
    bio: "",
  });

  const [profileImage, setProfileImage] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error" | "">("");

  const [selectedCountryCode, setSelectedCountryCode] =
    useState("");

  const [selectedStateCode, setSelectedStateCode] =
    useState("");

  const [states, setStates] =
    useState<LocationItem[]>([]);

  const [cities, setCities] =
    useState<LocationItem[]>([]);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

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
      lga: "",
      city: "",
      community: "",
      address: "",
      location: country?.name || "",
    }));
  };

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
      lga: "",
      city: "",
      community: "",
      address: "",
      location: [
        selectedState?.name,
        previous.country,
      ]
        .filter(Boolean)
        .join(", "),
    }));
  };

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

  const handleLocationDetailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      updated.location = [
        updated.community,
        updated.city,
        updated.lga,
        updated.state,
        updated.country,
      ]
        .filter(Boolean)
        .join(", ");

      return updated;
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const fullName =
        formData.full_name.trim();

      const email =
        formData.email
          .trim()
          .toLowerCase();

      const password =
        formData.password;

      const phone =
        formData.phone.trim();

      const country =
        formData.country.trim();

      const state =
        formData.state.trim();

      const lga =
        formData.lga.trim();

      const city =
        formData.city.trim();

      const community =
        formData.community.trim();

      const address =
        formData.address.trim();

      const school =
        formData.school.trim();

      const interests =
        formData.interests.trim();

      const bio =
        formData.bio.trim();

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

      if (!phone) {
        throw new Error(
          "Please enter your phone number."
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

      if (!lga) {
        throw new Error(
          "Please enter your LGA or district."
        );
      }

      if (!city) {
        throw new Error(
          "Please select your city or town."
        );
      }

      if (!community) {
        throw new Error(
          "Please enter your community."
        );
      }

      if (!address) {
        throw new Error(
          "Please enter your address."
        );
      }

      if (!school) {
        throw new Error(
          "Please enter your school."
        );
      }

      if (!interests) {
        throw new Error(
          "Please enter your interests."
        );
      }

      if (profileImage) {
        if (
          profileImage.size >
          5 * 1024 * 1024
        ) {
          throw new Error(
            "Profile image must be 5MB or smaller."
          );
        }
      }

      /*
       * ------------------------------------------------
       * CHECK WHETHER ADMIN ALREADY CREATED PROFILE
       * ------------------------------------------------
       */

      const {
        data: existingProfile,
        error: existingProfileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", email)
        .maybeSingle();

      if (existingProfileError) {
        throw existingProfileError;
      }

      /*
       * ------------------------------------------------
       * CREATE AUTH ACCOUNT
       * ------------------------------------------------
       */

      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth.signUp({
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

      /*
       * ------------------------------------------------
       * PROFILE IMAGE
       * ------------------------------------------------
       */

      let profileImageUrl =
        existingProfile?.profile_image_url ||
        null;

      if (profileImage) {
        const fileExt =
          profileImage.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const fileName =
          `${authUserId}-${Date.now()}.${fileExt}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from("profile-images")
            .upload(
              fileName,
              profileImage,
              {
                upsert: true,
                contentType:
                  profileImage.type,
              }
            );

        if (uploadError) {
          console.error(
            "IMAGE UPLOAD ERROR:",
            uploadError
          );

          throw new Error(
            "Your account was created, but your profile image could not be uploaded."
          );
        }

        const {
          data: imageData,
        } =
          supabase.storage
            .from("profile-images")
            .getPublicUrl(
              fileName
            );

        profileImageUrl =
          imageData.publicUrl;
      }

      /*
       * ------------------------------------------------
       * FINAL LOCATION
       * ------------------------------------------------
       */

      const location = [
        community,
        city,
        lga,
        state,
        country,
      ]
        .filter(Boolean)
        .join(", ");

      /*
       * ------------------------------------------------
       * PROFILE DATA
       *
       * IMPORTANT:
       * profiles.id is NOT auth_user_id.
       * This prevents profiles_pkey conflicts.
       * ------------------------------------------------
       */

      const profileData = {
        auth_user_id:
          authUserId,

        full_name:
          fullName,

        email,

        phone,

        country,

        state,

        lga,

        city,

        community,

        address,

        location,

        school,

        interests,

        bio,

        profile_image_url:
          profileImageUrl,

        role: "member",

        /*
         * NEW USERS MUST WAIT FOR ADMIN.
         */
        status:
          existingProfile?.status ===
          "active"
            ? "active"
            : "pending",

        updated_at:
          new Date().toISOString(),
      };

      /*
       * ------------------------------------------------
       * ADMIN PRE-CREATED MEMBER
       *
       * Update the existing row instead of inserting
       * another row.
       * ------------------------------------------------
       */

      if (existingProfile) {
        const {
          error: updateError,
        } = await supabase
          .from("profiles")
          .update(profileData)
          .eq(
            "id",
            existingProfile.id
          );

        if (updateError) {
          console.error(
            "PROFILE UPDATE ERROR:",
            updateError
          );

          throw updateError;
        }
      }

      /*
       * ------------------------------------------------
       * COMPLETELY NEW MEMBER
       *
       * Do NOT specify profiles.id.
       * PostgreSQL generates it.
       * ------------------------------------------------
       */

      else {
        const {
          error: insertError,
        } = await supabase
          .from("profiles")
          .insert({
            ...profileData,
          });

        if (insertError) {
          console.error(
            "PROFILE INSERT ERROR:",
            insertError
          );

          /*
           * A trigger or another process may already
           * have created the profile using auth_user_id.
           *
           * Try one final update instead of failing.
           */

          const {
            data: profileCreatedElsewhere,
          } = await supabase
            .from("profiles")
            .select("id")
            .eq(
              "auth_user_id",
              authUserId
            )
            .maybeSingle();

          if (
            profileCreatedElsewhere
          ) {
            const {
              error:
                recoveryError,
            } =
              await supabase
                .from("profiles")
                .update(
                  profileData
                )
                .eq(
                  "id",
                  profileCreatedElsewhere.id
                );

            if (recoveryError) {
              throw recoveryError;
            }
          } else {
            throw insertError;
          }
        }
      }

      /*
       * ------------------------------------------------
       * GET CURRENT SESSION
       * ------------------------------------------------
       */

      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      /*
       * ------------------------------------------------
       * EMAIL CONFIRMATION SHOULD BE DISABLED
       *
       * Therefore a session should exist immediately.
       * ------------------------------------------------
       */

      if (!sessionData.session) {
        setMessage(
          "Your account was created. Please check your email confirmation settings before trying again."
        );

        setMessageType("error");

        setLoading(false);

        return;
      }

      /*
       * ------------------------------------------------
       * DIRECTLY ENTER MEMBER PORTAL
       * ------------------------------------------------
       */

      setMessage(
        "Registration successful! Your membership is awaiting admin approval."
      );

      setMessageType("success");

      setTimeout(() => {
        navigate(
          "/member-portal",
          {
            replace: true,
          }
        );
      }, 700);

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

          <form onSubmit={handleSubmit}>

            <div className="register-field">
              <label htmlFor="full_name">
                Full Name
              </label>

              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Enter your full name"
                value={
                  formData.full_name
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={
                  formData.email
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create your password"
                value={
                  formData.password
                }
                onChange={handleChange}
                minLength={6}
                required
              />

              <small>
                At least 6 characters.
              </small>
            </div>

            <div className="register-field">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={
                  formData.phone
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="country">
                Country
              </label>

              <select
                id="country"
                value={
                  selectedCountryCode
                }
                onChange={
                  handleCountryChange
                }
                required
              >
                <option value="">
                  Select your country
                </option>

                {africanCountries.map(
                  (country) => (
                    <option
                      key={
                        country.isoCode
                      }
                      value={
                        country.isoCode
                      }
                    >
                      {country.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="register-field">
              <label htmlFor="state">
                State / Province / Region
              </label>

              {states.length > 0 ? (
                <select
                  id="state"
                  value={
                    selectedStateCode
                  }
                  onChange={
                    handleStateChange
                  }
                  disabled={
                    !selectedCountryCode
                  }
                  required
                >
                  <option value="">
                    Select your state / region
                  </option>

                  {states.map(
                    (state) => (
                      <option
                        key={
                          state.isoCode
                        }
                        value={
                          state.isoCode
                        }
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
                  placeholder="Enter your state / region"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    !selectedCountryCode
                  }
                  required
                />
              )}
            </div>

            <div className="register-field">
              <label htmlFor="lga">
                LGA / District
              </label>

              <input
                id="lga"
                name="lga"
                type="text"
                placeholder="Enter your LGA / district"
                value={
                  formData.lga
                }
                onChange={
                  handleLocationDetailChange
                }
                disabled={
                  !selectedCountryCode
                }
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="city">
                City / Town
              </label>

              {cities.length > 0 ? (
                <select
                  id="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleCityChange
                  }
                  disabled={
                    !selectedStateCode
                  }
                  required
                >
                  <option value="">
                    Select your city / town
                  </option>

                  {cities.map(
                    (city, index) => (
                      <option
                        key={`${city.name}-${index}`}
                        value={
                          city.name
                        }
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
                  placeholder="Enter your city / town"
                  value={
                    formData.city
                  }
                  onChange={
                    handleLocationDetailChange
                  }
                  disabled={
                    !selectedCountryCode
                  }
                  required
                />
              )}
            </div>

            <div className="register-field">
              <label htmlFor="community">
                Community
              </label>

              <input
                id="community"
                name="community"
                type="text"
                placeholder="Enter your community"
                value={
                  formData.community
                }
                onChange={
                  handleLocationDetailChange
                }
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={
                  formData.address
                }
                onChange={
                  handleLocationDetailChange
                }
                required
              />
            </div>

            {formData.location && (
              <div className="register-field">
                <label>
                  Your Location
                </label>

                <input
                  type="text"
                  value={
                    formData.location
                  }
                  readOnly
                />
              </div>
            )}

            <div className="register-field">
              <label htmlFor="school">
                School
              </label>

              <input
                id="school"
                name="school"
                type="text"
                placeholder="Enter your school"
                value={
                  formData.school
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="interests">
                Interests
              </label>

              <input
                id="interests"
                name="interests"
                type="text"
                placeholder="e.g. Technology, Business, Writing"
                value={
                  formData.interests
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="bio">
                Tell us about yourself
              </label>

              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little about yourself..."
                value={
                  formData.bio
                }
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="register-field">
              <label htmlFor="profileImage">
                Profile Image
                <span> (Optional)</span>
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

            {message && (
              <div
                className={`register-message ${
                  messageType ===
                  "success"
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

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