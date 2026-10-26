import React, {

  useEffect,

  useMemo,

  useState,

} from "react";

import { useNavigate } from "react-router-dom";

import "./Register.css";

import { supabase } from "../../lib/supabase";

interface LocationItem {

  name: string;

  isoCode: string;

  countryCode?: string;

}

interface AfricaCountry {

  name: string;

  isoCode: string;

  states: Array<LocationItem & { cities: string[] }>;

}

const Register: React.FC = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    full_name: "",

    email: "",

    password: "",

    date_of_birth: "",

    phone: "",

    country: "",

    state: "",

    lga: "",

    city: "",

    location: "",

    address: "",

    school: "",

    interests: "",

    bio: "",

  });

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

  const [locationData, setLocationData] = useState<AfricaCountry[]>([]);

  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {

    let cancelled = false;

    const loadLocations = async () => {

      try {

        const response = await fetch("/data/africaLocations.json");

        if (!response.ok) {

          throw new Error(

            `Location data request failed: ${response.status}`

          );

        }

        const data = (await response.json()) as AfricaCountry[];

        if (!cancelled) {

          setLocationData(data);

        }

      } catch (error) {

        console.error("LOCATION DATA ERROR:", error);

      } finally {

        if (!cancelled) {

          setLocationsLoading(false);

        }

      }

    };

    loadLocations();

    return () => {

      cancelled = true;

    };

  }, []);

  const africanCountries = useMemo(() => {

    return [...locationData].sort((a, b) =>

      a.name.localeCompare(b.name)

    );

  }, [locationData]);

  useEffect(() => {

    if (!selectedCountryCode) {

      setStates([]);

      setCities([]);

      return;

    }

    const country = locationData.find(

      (item) => item.isoCode === selectedCountryCode

    );

    setStates(country?.states || []);

    setCities([]);

  }, [locationData, selectedCountryCode]);

  useEffect(() => {

    if (!selectedCountryCode || !selectedStateCode) {

      setCities([]);

      return;

    }

    const country = locationData.find(

      (item) => item.isoCode === selectedCountryCode

    );

    const selectedState = country?.states.find(

      (item) => item.isoCode === selectedStateCode

    );

    const stateCities = (selectedState?.cities || []).map(

      (name, index) => ({

        name,

        isoCode: `${selectedStateCode}-${index}`,

        countryCode: selectedCountryCode,

      })

    );

    setCities(stateCities);

  }, [locationData, selectedCountryCode, selectedStateCode]);

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

      location: "",

      address: "",

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

    }));

  };

  const handleCityChange = (

    e: React.ChangeEvent<HTMLSelectElement>

  ) => {

    setFormData((previous) => ({

      ...previous,

      city: e.target.value,

    }));

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

      const dateOfBirth = formData.date_of_birth.trim();

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

      const location =

        formData.location.trim();

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

      if (!dateOfBirth) {
        throw new Error("Please enter your date of birth.");
      }

      const birthDate = new Date(`${dateOfBirth}T00:00:00`);

      if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
        throw new Error("Please enter a valid date of birth.");
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

      if (!location) {

        throw new Error(

          "Please enter your present location."

        );

      }

      if (!address) {

        throw new Error(

          "Please enter your residential address."

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

      /*
       * CREATE AUTH ACCOUNT.
       * The database trigger handle_new_user() creates the profile.
       * Do not query or insert into profiles from this unauthenticated
       * page: RLS correctly prevents that.
       */
      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            date_of_birth: dateOfBirth,
            phone,
            country,
            state,
            lga,
            city,
            location,
            address,
            school,
            interests,
            bio,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Your account could not be created.");
      }

      /*

       * GET CURRENT SESSION

       */

      const {

        data: sessionData,

      } =

        await supabase.auth.getSession();

      if (!sessionData.session) {

        setMessage(
          "If registration is available for this email, you’ll receive the next steps by email. If you already have an account, please sign in or use Forgot password."
        );

        setMessageType("error");

        return;

      }

      // Link an admin-precreated profile only after a verified session
      // exists. For newly created profiles this safely returns no claim.
      const { error: claimError } = await supabase.rpc(
        "claim_my_pending_profile"
      );

      if (claimError) {
        console.error("Profile claim check failed after registration:", claimError);
      }

      setMessage(
 
        "Registration successful! Your membership is awaiting admin approval."
 
      );

      setMessageType("success");

      navigate("/member-portal", { replace: true });

    } catch (error: any) {

      console.error(

        "REGISTRATION ERROR:",

        error

      );

      const rawMessage = String(error?.message || "");
      const isBackendError =
        /supabase|row-level security|violates row level|duplicate key|already registered|database|postgres|auth\/v1/i.test(rawMessage);

      setMessage(
        isBackendError
          ? "We couldn’t complete registration with those details. If you already have an account, please sign in or use Forgot password. Otherwise, try again later."
          : (rawMessage || "We couldn’t complete registration. Please try again.")
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
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
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

                  onChange={handleChange}

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

                onChange={handleChange}

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

                  onChange={handleChange}

                  disabled={

                    !selectedCountryCode

                  }

                  required

                />

              )}

            </div>

            <div className="register-field">

              <label htmlFor="location">

                Present Location

              </label>

              <input

                id="location"

                name="location"

                type="text"

                placeholder="Where do you currently live?"

                value={

                  formData.location

                }

                onChange={handleChange}

                required

              />

            </div>

            <div className="register-field">

              <label htmlFor="address">

                Residential Address

              </label>

              <input

                id="address"

                name="address"

                type="text"

                placeholder="Enter your residential address"

                value={

                  formData.address

                }

                onChange={handleChange}

                required

              />

            </div>

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