import React, { useEffect, useMemo, useState } from "react";
import countries from "world-countries";
import { supabase } from "../../lib/supabase";
import "./Membership.css";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  school: string | null;
  interests: string | null;
  bio: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  city: string | null;
  community: string | null;
  address: string | null;
  auth_user_id: string | null;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  community: string;
  address: string;
  school: string;
  interests: string;
  bio: string;
  status: string;
}

interface LocationData {
  states: string[];
  lgas: Record<string, string[]>;
}

/*
 * Get African countries directly from world-countries.
 * This means you no longer have to manually maintain
 * the African country list.
 */
const AFRICAN_COUNTRIES = countries
  .filter((country) => country.region === "Africa")
  .sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

const emptyForm: FormData = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  lga: "",
  city: "",
  community: "",
  address: "",
  school: "",
  interests: "",
  bio: "",
  status: "pending",
};

/*
 * Location data currently available in the application.
 *
 * Countries not listed here will still work.
 * Their state/region and district fields will become
 * normal text inputs instead of select boxes.
 */
const LOCATION_OPTIONS: Record<string, LocationData> = {
  Nigeria: {
    states: [
      "Abia",
      "Adamawa",
      "Akwa Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nasarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Plateau",
      "Rivers",
      "Sokoto",
      "Taraba",
      "Yobe",
      "Zamfara",
      "Federal Capital Territory",
    ],

    lgas: {
      "Federal Capital Territory": [
        "Abaji",
        "Abuja Municipal Area Council",
        "Bwari",
        "Gwagwalada",
        "Kuje",
        "Kwali",
      ],

      Abia: [
        "Aba North",
        "Aba South",
        "Arochukwu",
        "Bende",
        "Ikwuano",
        "Isiala Ngwa North",
        "Isiala Ngwa South",
        "Isuikwuato",
        "Obi Ngwa",
        "Ohafia",
        "Osisioma",
        "Ugwunagbo",
        "Ukwa East",
        "Ukwa West",
        "Umuahia North",
        "Umuahia South",
        "Umunneochi",
      ],

      Anambra: [
        "Aguata",
        "Awka North",
        "Awka South",
        "Anambra East",
        "Anambra West",
        "Anaocha",
        "Dunukofia",
        "Ekwusigo",
        "Idemili North",
        "Idemili South",
        "Ihiala",
        "Njikoka",
        "Nnewi North",
        "Nnewi South",
        "Ogbaru",
        "Onitsha North",
        "Onitsha South",
        "Orumba North",
        "Orumba South",
        "Oyi",
      ],

      Lagos: [
        "Agege",
        "Ajeromi-Ifelodun",
        "Alimosho",
        "Amuwo-Odofin",
        "Apapa",
        "Badagry",
        "Epe",
        "Eti-Osa",
        "Ibeju-Lekki",
        "Ifako-Ijaiye",
        "Ikeja",
        "Ikorodu",
        "Kosofe",
        "Lagos Island",
        "Lagos Mainland",
        "Mushin",
        "Ojo",
        "Oshodi-Isolo",
        "Shomolu",
        "Surulere",
      ],

      Rivers: [
        "Abua-Odual",
        "Ahoada East",
        "Ahoada West",
        "Akuku-Toru",
        "Andoni",
        "Asari-Toru",
        "Bonny",
        "Degema",
        "Eleme",
        "Emohua",
        "Etche",
        "Gokana",
        "Ikwerre",
        "Khana",
        "Obio-Akpor",
        "Ogba-Egbema-Ndoni",
        "Ogu-Bolo",
        "Okrika",
        "Omuma",
        "Opobo-Nkoro",
        "Oyigbo",
        "Port Harcourt",
        "Tai",
      ],

      Enugu: [
        "Aninri",
        "Awgu",
        "Enugu East",
        "Enugu North",
        "Enugu South",
        "Ezeagu",
        "Igbo-Etiti",
        "Igbo-Eze North",
        "Igbo-Eze South",
        "Isi-Uzo",
        "Nkanu East",
        "Nkanu West",
        "Nsukka",
        "Oji River",
        "Udenu",
        "Udi",
        "Uzo-Uwani",
      ],
    },
  },

  Ghana: {
    states: [
      "Greater Accra",
      "Ashanti",
      "Brong-Ahafo",
      "Central",
      "Eastern",
      "Northern",
      "North East",
      "Oti",
      "Savannah",
      "Upper East",
      "Upper West",
      "Volta",
      "Western",
      "Western North",
    ],
    lgas: {},
  },

  Kenya: {
    states: [
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Kiambu",
      "Machakos",
      "Kajiado",
      "Uasin Gishu",
      "Kakamega",
      "Meru",
      "Nyeri",
      "Kilifi",
      "Bungoma",
      "Murang'a",
      "Narok",
      "Bomet",
      "Kericho",
      "Laikipia",
      "Nandi",
      "Trans Nzoia",
    ],
    lgas: {},
  },

  "South Africa": {
    states: [
      "Eastern Cape",
      "Free State",
      "Gauteng",
      "KwaZulu-Natal",
      "Limpopo",
      "Mpumalanga",
      "Northern Cape",
      "North West",
      "Western Cape",
    ],
    lgas: {},
  },

  Tanzania: {
    states: [
      "Arusha",
      "Dar es Salaam",
      "Dodoma",
      "Geita",
      "Iringa",
      "Kagera",
      "Katavi",
      "Kigoma",
      "Kilimanjaro",
      "Lindi",
      "Manyara",
      "Mara",
      "Mbeya",
      "Morogoro",
      "Mtwara",
      "Mwanza",
      "Njombe",
      "Pemba North",
      "Pemba South",
      "Pwani",
      "Rukwa",
      "Ruvuma",
      "Shinyanga",
      "Simiyu",
      "Singida",
      "Songwe",
      "Tabora",
      "Tanga",
      "Zanzibar North",
      "Zanzibar South",
      "Zanzibar West",
    ],
    lgas: {},
  },

  Uganda: {
    states: [
      "Central Region",
      "Eastern Region",
      "Northern Region",
      "Western Region",
      "Kampala",
    ],
    lgas: {},
  },

  Rwanda: {
    states: [
      "Kigali",
      "Eastern Province",
      "Northern Province",
      "Southern Province",
      "Western Province",
    ],
    lgas: {},
  },

  Cameroon: {
    states: [
      "Adamawa",
      "Centre",
      "East",
      "Far North",
      "Littoral",
      "North",
      "North-West",
      "South",
      "South-West",
      "West",
    ],
    lgas: {},
  },

  Ethiopia: {
    states: [
      "Addis Ababa",
      "Afar",
      "Amhara",
      "Benishangul-Gumuz",
      "Central Ethiopia",
      "Dire Dawa",
      "Gambela",
      "Harari",
      "Oromia",
      "Sidama",
      "Somali",
      "South Ethiopia",
      "South West Ethiopia",
      "Tigray",
    ],
    lgas: {},
  },

  Zambia: {
    states: [
      "Central",
      "Copperbelt",
      "Eastern",
      "Luapula",
      "Lusaka",
      "Muchinga",
      "Northern",
      "North-Western",
      "Southern",
      "Western",
    ],
    lgas: {},
  },

  Zimbabwe: {
    states: [
      "Bulawayo",
      "Harare",
      "Manicaland",
      "Mashonaland Central",
      "Mashonaland East",
      "Mashonaland West",
      "Masvingo",
      "Matabeleland North",
      "Matabeleland South",
      "Midlands",
    ],
    lgas: {},
  },

  Botswana: {
    states: [
      "Central",
      "Chobe",
      "Francistown",
      "Gaborone",
      "Ghanzi",
      "Kgalagadi",
      "Kgatleng",
      "Kweneng",
      "North East",
      "North West",
      "South East",
      "Southern",
    ],
    lgas: {},
  },

  Namibia: {
    states: [
      "Erongo",
      "Hardap",
      "Karas",
      "Kavango East",
      "Kavango West",
      "Khomas",
      "Kunene",
      "Ohangwena",
      "Omaheke",
      "Omusati",
      "Oshana",
      "Oshikoto",
      "Otjozondjupa",
      "Zambezi",
    ],
    lgas: {},
  },

  Malawi: {
    states: [
      "Central Region",
      "Northern Region",
      "Southern Region",
    ],
    lgas: {},
  },

  Mozambique: {
    states: [
      "Cabo Delgado",
      "Gaza",
      "Inhambane",
      "Manica",
      "Maputo",
      "Maputo City",
      "Nampula",
      "Niassa",
      "Sofala",
      "Tete",
      "Zambezia",
    ],
    lgas: {},
  },

  Senegal: {
    states: [
      "Dakar",
      "Diourbel",
      "Fatick",
      "Kaffrine",
      "Kaolack",
      "Kedougou",
      "Kolda",
      "Louga",
      "Matam",
      "Saint-Louis",
      "Sedhiou",
      "Tambacounda",
      "Thies",
      "Ziguinchor",
    ],
    lgas: {},
  },

  "Ivory Coast": {
    states: [
      "Abidjan",
      "Bas-Sassandra",
      "Comoe",
      "Denguele",
      "Goh-Djiboua",
      "Lacs",
      "Lagunes",
      "Montagnes",
      "Sassandra-Marahoue",
      "Savanes",
      "Vallee du Bandama",
      "Woroba",
      "Yamoussoukro",
      "Zanzan",
    ],
    lgas: {},
  },

  Egypt: {
    states: [
      "Cairo",
      "Alexandria",
      "Giza",
      "Qalyubia",
      "Port Said",
      "Suez",
      "Luxor",
      "Aswan",
      "Red Sea",
      "Beheira",
      "Dakahlia",
      "Damietta",
      "Fayoum",
      "Gharbia",
      "Ismailia",
      "Kafr El Sheikh",
      "Matrouh",
      "Minya",
      "Monufia",
      "New Valley",
      "North Sinai",
      "Qena",
      "Sharqia",
      "Sohag",
      "South Sinai",
    ],
    lgas: {},
  },
};

const Membership: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [editingMember, setEditingMember] =
    useState<Member | null>(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] =
    useState<FormData>(emptyForm);

  const [nameSuggestions, setNameSuggestions] =
    useState<Member[]>([]);

  const [duplicateMember, setDuplicateMember] =
    useState<Member | null>(null);

  const loadMembers = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          phone,
          location,
          school,
          interests,
          bio,
          role,
          status,
          created_at,
          updated_at,
          country,
          state,
          lga,
          city,
          community,
          address,
          auth_user_id
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setMembers((data || []) as Member[]);
    } catch (error: any) {
      console.error("LOAD MEMBERS ERROR:", error);

      alert(
        error?.message ||
          "Unable to load members."
      );

      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData((previous) => ({
        ...previous,
        country: value,
        state: "",
        lga: "",
        city: "",
        community: "",
      }));

      setDuplicateMember(null);
      return;
    }

    if (name === "state") {
      setFormData((previous) => ({
        ...previous,
        state: value,
        lga: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "full_name") {
      const typedName = value.trim().toLowerCase();

      if (typedName.length < 2) {
        setNameSuggestions([]);
        return;
      }

      const suggestions = members
        .filter((member) =>
          member.full_name
            ?.toLowerCase()
            .includes(typedName)
        )
        .slice(0, 5);

      setNameSuggestions(suggestions);
    }

    if (name === "email") {
      const typedEmail = value.trim().toLowerCase();

      if (!typedEmail) {
        setDuplicateMember(null);
        return;
      }

      const existing = members.find(
        (member) =>
          member.email?.trim().toLowerCase() ===
            typedEmail &&
          member.id !== editingMember?.id
      );

      setDuplicateMember(existing || null);
    }
  };

  const selectExistingMember = (member: Member) => {
    setFormData({
      full_name: member.full_name || "",
      email: member.email || "",
      phone: member.phone || "",
      country: member.country || "",
      state: member.state || "",
      lga: member.lga || "",
      city: member.city || "",
      community: member.community || "",
      address: member.address || "",
      school: member.school || "",
      interests: member.interests || "",
      bio: member.bio || "",
      status: member.status || "pending",
    });

    setNameSuggestions([]);
    setDuplicateMember(member);
  };

  const handleAddMember = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const fullName = formData.full_name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!fullName) {
      alert("Please enter the member's full name.");
      return;
    }

    if (!email) {
      alert("Please enter the member's email.");
      return;
    }

    const localExisting = members.find(
      (member) =>
        member.email?.trim().toLowerCase() === email
    );

    if (localExisting) {
      setDuplicateMember(localExisting);

      alert(
        `This member already exists.\n\nName: ${localExisting.full_name}\nEmail: ${localExisting.email}`
      );

      return;
    }

    setSaving(true);

    try {
      const {
        data: existingMember,
        error: checkError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          phone,
          location,
          school,
          interests,
          bio,
          role,
          status,
          created_at,
          updated_at,
          country,
          state,
          lga,
          city,
          community,
          address,
          auth_user_id
        `)
        .ilike("email", email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingMember) {
        setDuplicateMember(existingMember as Member);

        alert(
          `This member already exists.\n\nName: ${existingMember.full_name}\nEmail: ${existingMember.email}`
        );

        await loadMembers();
        return;
      }

      const location = [
        formData.community.trim(),
        formData.city.trim(),
        formData.lga.trim(),
        formData.state.trim(),
        formData.country.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      const { error } = await supabase
        .from("profiles")
        .insert({
          full_name: fullName,
          email,
          phone: formData.phone.trim() || null,
          country: formData.country.trim() || null,
          state: formData.state.trim() || null,
          lga: formData.lga.trim() || null,
          city: formData.city.trim() || null,
          community:
            formData.community.trim() || null,
          address: formData.address.trim() || null,
          location: location || null,
          school: formData.school.trim() || null,
          interests:
            formData.interests.trim() || null,
          bio: formData.bio.trim() || null,
          role: "member",
          status: formData.status || "pending",
          auth_user_id: null,
        });

      if (error) {
        throw error;
      }

      alert(
        `Member added successfully.\n\n${fullName} has been added to the membership list.\n\nNo password or account was created.`
      );

      setFormData(emptyForm);
      setNameSuggestions([]);
      setDuplicateMember(null);
      setShowAddForm(false);

      await loadMembers();
    } catch (error: any) {
      console.error("ADD MEMBER ERROR:", error);

      alert(
        error?.message ||
          "Unable to add member."
      );
    } finally {
      setSaving(false);
    }
  };

  const openEditMember = (member: Member) => {
    setEditingMember(member);

    setFormData({
      full_name: member.full_name || "",
      email: member.email || "",
      phone: member.phone || "",
      country: member.country || "",
      state: member.state || "",
      lga: member.lga || "",
      city: member.city || "",
      community: member.community || "",
      address: member.address || "",
      school: member.school || "",
      interests: member.interests || "",
      bio: member.bio || "",
      status: member.status || "pending",
    });

    setDuplicateMember(null);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdateMember = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingMember) {
      return;
    }

    const fullName = formData.full_name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!fullName) {
      alert("Please enter the member's full name.");
      return;
    }

    if (!email) {
      alert("Please enter the member's email.");
      return;
    }

    const duplicate = members.find(
      (member) =>
        member.id !== editingMember.id &&
        member.email?.trim().toLowerCase() === email
    );

    if (duplicate) {
      setDuplicateMember(duplicate);

      alert(
        `Another member already uses this email.\n\n${duplicate.full_name}\n${duplicate.email}`
      );

      return;
    }

    setSaving(true);

    try {
      const location = [
        formData.community.trim(),
        formData.city.trim(),
        formData.lga.trim(),
        formData.state.trim(),
        formData.country.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          email,
          phone: formData.phone.trim() || null,
          country: formData.country.trim() || null,
          state: formData.state.trim() || null,
          lga: formData.lga.trim() || null,
          city: formData.city.trim() || null,
          community:
            formData.community.trim() || null,
          address: formData.address.trim() || null,
          location: location || null,
          school: formData.school.trim() || null,
          interests:
            formData.interests.trim() || null,
          bio: formData.bio.trim() || null,
          status: formData.status || "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingMember.id);

      if (error) {
        throw error;
      }

      alert("Member information updated successfully.");

      setShowEditForm(false);
      setEditingMember(null);
      setFormData(emptyForm);

      await loadMembers();
    } catch (error: any) {
      console.error("UPDATE MEMBER ERROR:", error);

      alert(
        error?.message ||
          "Unable to update member."
      );
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (
    member: Member,
    status: string
  ) => {
    setUpdating(member.id);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", member.id);

      if (error) {
        throw error;
      }

      setMembers((previous) =>
        previous.map((item) =>
          item.id === member.id
            ? { ...item, status }
            : item
        )
      );
    } catch (error: any) {
      console.error("STATUS UPDATE ERROR:", error);

      alert(
        error?.message ||
          "Unable to change member status."
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteMember = async (
    member: Member
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.full_name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(member.id);

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", member.id);

      if (error) {
        throw error;
      }

      setMembers((previous) =>
        previous.filter(
          (item) => item.id !== member.id
        )
      );

      alert("Member deleted successfully.");
    } catch (error: any) {
      console.error("DELETE MEMBER ERROR:", error);

      alert(
        error?.message ||
          "Unable to delete member."
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredMembers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return members;
    }

    return members.filter((member) =>
      [
        member.full_name,
        member.email,
        member.phone,
        member.country,
        member.state,
        member.lga,
        member.city,
        member.community,
        member.school,
        member.interests,
      ].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
  }, [members, search]);

  const activeCount = members.filter(
    (member) => member.status === "active"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "pending"
  ).length;

  const inactiveCount = members.filter(
    (member) => member.status === "inactive"
  ).length;

  const selectedCountry =
    LOCATION_OPTIONS[formData.country];

  const availableStates =
    selectedCountry?.states || [];

  const availableLgas =
    selectedCountry?.lgas?.[formData.state] || [];

  const resetForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingMember(null);
    setDuplicateMember(null);
    setNameSuggestions([]);
    setFormData(emptyForm);
  };

  const renderMemberForm = (isEdit: boolean) => (
    <section className="membership-form-card">
      <div className="membership-form-header">
        <h2>
          {isEdit
            ? "Edit Member"
            : "Add New Member"}
        </h2>

        <p>
          {isEdit
            ? "Update this member's information."
            : "Add basic membership information. No password or account is created."}
        </p>
      </div>

      <form
        onSubmit={
          isEdit
            ? handleUpdateMember
            : handleAddMember
        }
      >
        <div className="membership-form-grid">
          <div className="membership-field">
            <label htmlFor="full_name">
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              autoComplete="off"
              required
            />

            {!isEdit &&
              nameSuggestions.length > 0 && (
                <div className="membership-suggestions">
                  <strong>Existing members</strong>

                  {nameSuggestions.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      className="membership-suggestion"
                      onClick={() =>
                        selectExistingMember(member)
                      }
                    >
                      <span>
                        {member.full_name}
                      </span>

                      <small>
                        {member.email}
                      </small>
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div className="membership-field">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />

            {duplicateMember && !isEdit && (
              <div className="membership-duplicate-warning">
                <strong>
                  This member already exists
                </strong>

                <span>
                  {duplicateMember.full_name} already
                  has this email.
                </span>
              </div>
            )}
          </div>

          <div className="membership-field">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="membership-field">
            <label htmlFor="country">
              Country
            </label>

            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">
                Select African country
              </option>

              {AFRICAN_COUNTRIES.map((country) => (
                <option
                  key={country.cca3}
                  value={country.name.common}
                >
                  {country.name.common}
                </option>
              ))}
            </select>
          </div>

          <div className="membership-field">
            <label htmlFor="state">
              State / Province / Region
            </label>

            {availableStates.length > 0 ? (
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">
                  Select state / region
                </option>

                {availableStates.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder={
                  formData.country
                    ? "Enter state, province or region"
                    : "Select country first"
                }
                disabled={!formData.country}
              />
            )}
          </div>

          <div className="membership-field">
            <label htmlFor="lga">
              LGA / District / County
            </label>

            {availableLgas.length > 0 ? (
              <select
                id="lga"
                name="lga"
                value={formData.lga}
                onChange={handleChange}
              >
                <option value="">
                  Select LGA / district
                </option>

                {availableLgas.map((lga) => (
                  <option
                    key={lga}
                    value={lga}
                  >
                    {lga}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="lga"
                name="lga"
                type="text"
                value={formData.lga}
                onChange={handleChange}
                placeholder={
                  formData.country
                    ? "Enter district, county, LGA..."
                    : "Select country first"
                }
                disabled={!formData.country}
              />
            )}
          </div>

          <div className="membership-field">
            <label htmlFor="city">
              City / Town
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city or town"
            />
          </div>

          <div className="membership-field">
            <label htmlFor="community">
              Community / Area
            </label>

            <input
              id="community"
              name="community"
              type="text"
              value={formData.community}
              onChange={handleChange}
              placeholder="Enter community or area"
            />
          </div>

          <div className="membership-field">
            <label htmlFor="school">
              School
            </label>

            <input
              id="school"
              name="school"
              type="text"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter school"
            />
          </div>

          <div className="membership-field">
            <label htmlFor="interests">
              Interests
            </label>

            <input
              id="interests"
              name="interests"
              type="text"
              value={formData.interests}
              onChange={handleChange}
              placeholder="Technology, Business, Writing..."
            />
          </div>

          {isEdit && (
            <div className="membership-field">
              <label htmlFor="status">
                Membership Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          )}
        </div>

        <div className="membership-field">
          <label htmlFor="address">
            Address
          </label>

          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div className="membership-field">
          <label htmlFor="bio">
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about the member..."
            rows={4}
          />
        </div>

        {!isEdit && (
          <div className="membership-pending-info">
            <strong>
              No password is created.
            </strong>

            <p>
              The admin only creates the membership
              record. The member creates their own
              account later.
            </p>
          </div>
        )}

        <div className="membership-form-actions">
          <button
            type="submit"
            className="membership-save-button"
            disabled={
              saving ||
              (!isEdit && !!duplicateMember)
            }
          >
            {saving
              ? isEdit
                ? "Saving Changes..."
                : "Adding Member..."
              : isEdit
              ? "Save Changes"
              : "Add Member"}
          </button>

          <button
            type="button"
            className="membership-cancel-button"
            onClick={resetForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );

  return (
    <main className="membership-page">
      <div className="membership-header">
        <div>
          <h1>Membership</h1>

          <p>
            Manage all registered Teens Connect
            Africa members.
          </p>
        </div>

        <button
          type="button"
          className="membership-add-button"
          onClick={() => {
            setShowAddForm(true);
            setShowEditForm(false);
            setEditingMember(null);
            setFormData(emptyForm);
            setDuplicateMember(null);
            setNameSuggestions([]);
          }}
        >
          + Add Member
        </button>
      </div>

      <div className="membership-summary">
        <div className="membership-summary-card">
          <span>Total Members</span>
          <strong>{members.length}</strong>
        </div>

        <div className="membership-summary-card">
          <span>Active Members</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="membership-summary-card">
          <span>Pending Members</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="membership-summary-card">
          <span>Inactive Members</span>
          <strong>{inactiveCount}</strong>
        </div>
      </div>

      {showAddForm && renderMemberForm(false)}

      {showEditForm && renderMemberForm(true)}

      <div className="membership-toolbar">
        <input
          type="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search members by name, email, phone, location, school..."
          className="membership-search"
        />

        <span className="membership-count">
          {filteredMembers.length} member
          {filteredMembers.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      <section className="membership-list">
        {loading ? (
          <div className="membership-loading">
            Loading registered members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="membership-empty">
            <h3>No members found</h3>

            <p>
              There are currently no members
              matching your search.
            </p>
          </div>
        ) : (
          <div className="membership-table-wrapper">
            <table className="membership-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>School</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="membership-member">
                        <div className="membership-avatar">
                          <span>
                            {member.full_name
                              ?.charAt(0)
                              .toUpperCase() || "M"}
                          </span>
                        </div>

                        <div>
                          <strong>
                            {member.full_name}
                          </strong>

                          <small>
                            {member.role}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>{member.email}</td>

                    <td>
                      {member.phone ||
                        "Not provided"}
                    </td>

                    <td>
                      {[
                        member.community,
                        member.city,
                        member.lga,
                        member.state,
                        member.country,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        member.location ||
                        "Not provided"}
                    </td>

                    <td>
                      {member.school ||
                        "Not provided"}
                    </td>

                    <td>
                      <span
                        className={`membership-status ${
                          member.status === "active"
                            ? "active"
                            : member.status ===
                              "pending"
                            ? "pending"
                            : "inactive"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        member.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <div className="membership-actions">
                        <button
                          type="button"
                          className="membership-edit-button"
                          onClick={() =>
                            openEditMember(member)
                          }
                        >
                          Edit
                        </button>

                        {member.status !==
                          "active" && (
                          <button
                            type="button"
                            className="membership-activate-button"
                            disabled={
                              updating ===
                              member.id
                            }
                            onClick={() =>
                              changeStatus(
                                member,
                                "active"
                              )
                            }
                          >
                            {updating === member.id
                              ? "..."
                              : "Activate"}
                          </button>
                        )}

                        {member.status ===
                          "active" && (
                          <button
                            type="button"
                            className="membership-deactivate-button"
                            disabled={
                              updating ===
                              member.id
                            }
                            onClick={() =>
                              changeStatus(
                                member,
                                "inactive"
                              )
                            }
                          >
                            {updating === member.id
                              ? "..."
                              : "Deactivate"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="membership-delete-button"
                          disabled={
                            deleting === member.id
                          }
                          onClick={() =>
                            handleDeleteMember(
                              member
                            )
                          }
                        >
                          {deleting === member.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Membership;