import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import countries from "world-countries";
import { supabase } from "../../lib/supabase";
import "./Membership.css";

interface Member {
  id: string;
  full_name: string;
  email: string;
  age: number | null;
  phone: string | null;
  location: string | null;
  address: string | null;
  school: string | null;
  interests: string | null;
  bio: string | null;
  profile_image_url: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  city: string | null;
  community: string | null;
  auth_user_id: string | null;
}

interface FormData {
  full_name: string;
  email: string;
  age: string;
  phone: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  location: string;
  address: string;
  school: string;
  interests: string;
  bio: string;
  status: string;
}

const AFRICAN_COUNTRIES = countries
  .filter(
    (country) =>
      country.region === "Africa"
  )
  .sort((a, b) =>
    a.name.common.localeCompare(
      b.name.common
    )
  );

const emptyForm: FormData = {
  full_name: "",
  email: "",
  age: "",
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
  status: "pending",
};

const Membership: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState<string | null>(null);

  const [updating, setUpdating] =
    useState<string | null>(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [editingMember, setEditingMember] =
    useState<Member | null>(null);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState<FormData>(emptyForm);

  const [duplicateMember, setDuplicateMember] =
    useState<Member | null>(null);

  const [nameSuggestions, setNameSuggestions] =
    useState<Member[]>([]);

  /*
   * LOAD ALL EXISTING MEMBERS
   */
  const loadMembers = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          age,
          phone,
          location,
          address,
          school,
          interests,
          bio,
          profile_image_url,
          role,
          status,
          created_at,
          updated_at,
          country,
          state,
          lga,
          city,
          community,
          auth_user_id
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (fetchError) {
        throw fetchError;
      }

      setMembers(
        (data || []) as Member[]
      );

    } catch (loadError: any) {
      console.error(
        "LOAD MEMBERS ERROR:",
        loadError
      );

      setError(
        loadError?.message ||
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

  /*
   * HANDLE FORM CHANGES
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (name === "full_name") {
      const searchName =
        value
          .trim()
          .toLowerCase();

      if (searchName.length >= 2) {
        setNameSuggestions(
          members
            .filter(
              (member) =>
                member.full_name
                  ?.toLowerCase()
                  .includes(searchName)
            )
            .slice(0, 5)
        );
      } else {
        setNameSuggestions([]);
      }
    }

    if (name === "email") {
      const email =
        value
          .trim()
          .toLowerCase();

      const existing =
        members.find(
          (member) =>
            member.email
              ?.trim()
              .toLowerCase() ===
            email
        );

      setDuplicateMember(
        existing || null
      );
    }
  };

  /*
   * SELECT EXISTING MEMBER
   */
  const selectExistingMember = (
    member: Member
  ) => {
    setFormData({
      full_name:
        member.full_name || "",

      email:
        member.email || "",

      age:
        member.age !== null &&
        member.age !== undefined
          ? String(member.age)
          : "",

      phone:
        member.phone || "",

      country:
        member.country || "",

      state:
        member.state || "",

      lga:
        member.lga || "",

      city:
        member.city || "",

      location:
        member.location || "",

      address:
        member.address || "",

      school:
        member.school || "",

      interests:
        member.interests || "",

      bio:
        member.bio || "",

      status:
        member.status ||
        "pending",
    });

    setDuplicateMember(member);
    setNameSuggestions([]);
  };

  /*
   * ADD MEMBER
   */
  const handleAddMember = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const fullName =
      formData.full_name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const age =
      Number(formData.age);

    if (!fullName) {
      setError(
        "Full name is required."
      );
      return;
    }

    if (!email) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (
      !Number.isInteger(age) ||
      age < 10 ||
      age > 100
    ) {
      setError(
        "Please enter a valid age."
      );
      return;
    }

    /*
     * CHECK DUPLICATE BEFORE INSERT
     */
    const {
      data: existingMember,
      error: duplicateError,
    } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email"
      )
      .ilike(
        "email",
        email
      )
      .maybeSingle();

    if (duplicateError) {
      setError(
        duplicateError.message
      );
      return;
    }

    if (existingMember) {
      const member =
        existingMember as Member;

      setDuplicateMember(
        member
      );

      setError(
        `This member already exists: ${existingMember.full_name} (${existingMember.email}).`
      );

      return;
    }

    setSaving(true);

    try {
      const {
        error: insertError,
      } = await supabase
        .from("profiles")
        .insert({
          full_name:
            fullName,

          email,

          age,

          phone:
            formData.phone.trim() ||
            null,

          country:
            formData.country.trim() ||
            null,

          state:
            formData.state.trim() ||
            null,

          lga:
            formData.lga.trim() ||
            null,

          city:
            formData.city.trim() ||
            null,

          location:
            formData.location.trim() ||
            null,

          address:
            formData.address.trim() ||
            null,

          school:
            formData.school.trim() ||
            null,

          interests:
            formData.interests.trim() ||
            null,

          bio:
            formData.bio.trim() ||
            null,

          role: "member",

          status:
            formData.status ||
            "pending",
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess(
        "Member was successfully added."
      );

      setFormData(
        emptyForm
      );

      setDuplicateMember(null);
      setNameSuggestions([]);
      setShowAddForm(false);

      await loadMembers();

    } catch (addError: any) {
      console.error(
        "ADD MEMBER ERROR:",
        addError
      );

      setError(
        addError?.message ||
          "Unable to add member."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * OPEN EDIT
   */
  const openEditMember = (
    member: Member
  ) => {
    setEditingMember(
      member
    );

    setFormData({
      full_name:
        member.full_name || "",

      email:
        member.email || "",

      age:
        member.age !== null &&
        member.age !== undefined
          ? String(member.age)
          : "",

      phone:
        member.phone || "",

      country:
        member.country || "",

      state:
        member.state || "",

      lga:
        member.lga || "",

      city:
        member.city || "",

      location:
        member.location || "",

      address:
        member.address || "",

      school:
        member.school || "",

      interests:
        member.interests || "",

      bio:
        member.bio || "",

      status:
        member.status ||
        "pending",
    });

    setShowEditForm(true);
    setShowAddForm(false);
    setDuplicateMember(null);
    setNameSuggestions([]);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * UPDATE MEMBER
   */
  const handleUpdateMember = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingMember) {
      return;
    }

    setError("");
    setSuccess("");

    const fullName =
      formData.full_name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const age =
      Number(formData.age);

    if (!fullName) {
      setError(
        "Full name is required."
      );
      return;
    }

    if (!email) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (
      !Number.isInteger(age) ||
      age < 10 ||
      age > 100
    ) {
      setError(
        "Please enter a valid age."
      );
      return;
    }

    const duplicate =
      members.find(
        (member) =>
          member.id !==
            editingMember.id &&
          member.email
            ?.trim()
            .toLowerCase() ===
            email
      );

    if (duplicate) {
      setDuplicateMember(
        duplicate
      );

      setError(
        `Another member already uses this email: ${duplicate.full_name}.`
      );

      return;
    }

    setSaving(true);

    try {
      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          full_name:
            fullName,

          email,

          age,

          phone:
            formData.phone.trim() ||
            null,

          country:
            formData.country.trim() ||
            null,

          state:
            formData.state.trim() ||
            null,

          lga:
            formData.lga.trim() ||
            null,

          city:
            formData.city.trim() ||
            null,

          location:
            formData.location.trim() ||
            null,

          address:
            formData.address.trim() ||
            null,

          school:
            formData.school.trim() ||
            null,

          interests:
            formData.interests.trim() ||
            null,

          bio:
            formData.bio.trim() ||
            null,

          status:
            formData.status ||
            "pending",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          editingMember.id
        );

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        "Member information updated successfully."
      );

      setShowEditForm(false);
      setEditingMember(null);
      setFormData(
        emptyForm
      );

      await loadMembers();

    } catch (updateError: any) {
      console.error(
        "UPDATE MEMBER ERROR:",
        updateError
      );

      setError(
        updateError?.message ||
          "Unable to update member."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * CHANGE STATUS
   */
  const changeStatus = async (
    member: Member,
    status: string
  ) => {
    setUpdating(
      member.id
    );

    setError("");
    setSuccess("");

    try {
      const {
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          status,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          member.id
        );

      if (updateError) {
        throw updateError;
      }

      setMembers(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              member.id
                ? {
                    ...item,
                    status,
                  }
                : item
          )
      );

      setSuccess(
        `${member.full_name} is now ${status}.`
      );

    } catch (statusError: any) {
      console.error(
        "STATUS UPDATE ERROR:",
        statusError
      );

      setError(
        statusError?.message ||
          "Unable to change member status."
      );
    } finally {
      setUpdating(null);
    }
  };

  /*
   * DELETE MEMBER
   */
  const handleDeleteMember = async (
    member: Member
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${member.full_name}?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(
      member.id
    );

    setError("");
    setSuccess("");

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("profiles")
        .delete()
        .eq(
          "id",
          member.id
        );

      if (deleteError) {
        throw deleteError;
      }

      setMembers(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              member.id
          )
      );

      setSuccess(
        `${member.full_name} has been deleted.`
      );

    } catch (deleteError: any) {
      console.error(
        "DELETE MEMBER ERROR:",
        deleteError
      );

      setError(
        deleteError?.message ||
          "Unable to delete member."
      );
    } finally {
      setDeleting(null);
    }
  };

  /*
   * FILTER MEMBERS
   */
  const filteredMembers =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return members;
      }

      return members.filter(
        (member) =>
          [
            member.full_name,
            member.email,
            member.phone,
            member.location,
            member.address,
            member.school,
            member.country,
            member.state,
            member.lga,
            member.city,
            member.interests,
          ].some(
            (field) =>
              field
                ?.toLowerCase()
                .includes(value)
          )
      );
    }, [
      members,
      search,
    ]);

  const activeCount =
    members.filter(
      (member) =>
        member.status ===
        "active"
    ).length;

  const pendingCount =
    members.filter(
      (member) =>
        member.status ===
        "pending"
    ).length;

  const inactiveCount =
    members.filter(
      (member) =>
        member.status ===
        "inactive"
    ).length;

  const resetForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingMember(null);
    setDuplicateMember(null);
    setNameSuggestions([]);
    setFormData(
      emptyForm
    );
  };

  /*
   * MEMBER FORM
   */
  const renderMemberForm = (
    isEdit: boolean
  ) => (
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
              value={
                formData.full_name
              }
              onChange={
                handleChange
              }
              placeholder="Enter full name"
              autoComplete="off"
              required
            />

            {!isEdit &&
              nameSuggestions.length >
                0 && (
                <div className="membership-suggestions">

                  <strong>
                    Existing members
                  </strong>

                  {nameSuggestions.map(
                    (member) => (
                      <button
                        key={
                          member.id
                        }
                        type="button"
                        className="membership-suggestion"
                        onClick={() =>
                          selectExistingMember(
                            member
                          )
                        }
                      >
                        <span>
                          {
                            member.full_name
                          }
                        </span>

                        <small>
                          {
                            member.email
                          }
                        </small>
                      </button>
                    )
                  )}

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
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Enter email address"
              required
            />

            {duplicateMember &&
              !isEdit && (
                <div className="membership-duplicate-warning">

                  <strong>
                    This member already exists
                  </strong>

                  <span>
                    {
                      duplicateMember.full_name
                    }{" "}
                    already has this email.
                  </span>

                </div>
              )}

          </div>

          <div className="membership-field">

            <label htmlFor="age">
              Age
            </label>

            <input
              id="age"
              name="age"
              type="number"
              min="10"
              max="100"
              value={
                formData.age
              }
              onChange={
                handleChange
              }
              placeholder="Enter age"
              required
            />

          </div>

          <div className="membership-field">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="Enter phone number"
              required
            />

          </div>

          <div className="membership-field">

            <label htmlFor="country">
              Country
            </label>

            <select
              id="country"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
              required
            >
              <option value="">
                Select African country
              </option>

              {AFRICAN_COUNTRIES.map(
                (country) => (
                  <option
                    key={
                      country.cca2
                    }
                    value={
                      country.name.common
                    }
                  >
                    {
                      country.name
                        .common
                    }
                  </option>
                )
              )}

            </select>

          </div>

          <div className="membership-field">

            <label htmlFor="state">
              State / Region
            </label>

            <input
              id="state"
              name="state"
              type="text"
              value={
                formData.state
              }
              onChange={
                handleChange
              }
              placeholder="Enter state or region"
            />

          </div>

          <div className="membership-field">

            <label htmlFor="lga">
              LGA / District
            </label>

            <input
              id="lga"
              name="lga"
              type="text"
              value={
                formData.lga
              }
              onChange={
                handleChange
              }
              placeholder="Enter LGA or district"
            />

          </div>

          <div className="membership-field">

            <label htmlFor="city">
              City / Town
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
              placeholder="Enter city or town"
            />

          </div>

          <div className="membership-field">

            <label htmlFor="location">
              Present Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={
                formData.location
              }
              onChange={
                handleChange
              }
              placeholder="Where the member currently lives"
              required
            />

          </div>

          <div className="membership-field">

            <label htmlFor="address">
              Residential Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              placeholder="Residential address"
              required
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
              value={
                formData.school
              }
              onChange={
                handleChange
              }
              placeholder="School name"
            />

          </div>

          <div className="membership-field">

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
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

          <div className="membership-field membership-field-full">

            <label htmlFor="interests">
              Interests
            </label>

            <input
              id="interests"
              name="interests"
              type="text"
              value={
                formData.interests
              }
              onChange={
                handleChange
              }
              placeholder="Technology, leadership..."
            />

          </div>

          <div className="membership-field membership-field-full">

            <label htmlFor="bio">
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              value={
                formData.bio
              }
              onChange={
                handleChange
              }
              placeholder="Short member biography..."
              rows={4}
            />

          </div>

        </div>

        <div className="membership-form-actions">

          <button
            type="submit"
            className="membership-save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Member"
              : "Add Member"}
          </button>

          <button
            type="button"
            className="membership-cancel-button"
            onClick={
              resetForm
            }
            disabled={saving}
          >
            Cancel
          </button>

        </div>

      </form>

    </section>
  );

  return (
    <main className="membership-page">

      <header className="membership-header">

        <div>

          <button
            type="button"
            className="membership-back-button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>

          <span className="membership-badge">
            TCA ADMIN
          </span>

          <h1>
            Membership
          </h1>

          <p>
            Manage Teens Connect Africa
            members and membership status.
          </p>

        </div>

        <button
          type="button"
          className="membership-add-button"
          onClick={() => {
            setShowAddForm(true);
            setShowEditForm(false);
            setEditingMember(null);
            setFormData(
              emptyForm
            );
            setDuplicateMember(null);
            setNameSuggestions([]);
            setError("");
            setSuccess("");
          }}
        >
          + Add Member
        </button>

      </header>

      {error && (
        <div className="membership-error">
          {error}
        </div>
      )}

      {success && (
        <div className="membership-success">
          {success}
        </div>
      )}

      <div className="membership-summary">

        <div className="membership-summary-card">
          <span>
            Total Members
          </span>

          <strong>
            {members.length}
          </strong>
        </div>

        <div className="membership-summary-card">
          <span>
            Active Members
          </span>

          <strong>
            {activeCount}
          </strong>
        </div>

        <div className="membership-summary-card">
          <span>
            Pending Members
          </span>

          <strong>
            {pendingCount}
          </strong>
        </div>

        <div className="membership-summary-card">
          <span>
            Inactive Members
          </span>

          <strong>
            {inactiveCount}
          </strong>
        </div>

      </div>

      {showAddForm &&
        renderMemberForm(false)}

      {showEditForm &&
        renderMemberForm(true)}

      <div className="membership-toolbar">

        <div>
          <h2>
            Registered Members
          </h2>

          <p>
            {filteredMembers.length} member
            {filteredMembers.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search name, email, phone, location, address..."
          className="membership-search"
        />

      </div>

      <section className="membership-list">

        {loading ? (

          <div className="membership-loading">
            Loading registered members...
          </div>

        ) : filteredMembers.length ===
          0 ? (

          <div className="membership-empty">

            <h3>
              No members found
            </h3>

            <p>
              {search
                ? "Try another search."
                : "Registered members will appear here."}
            </p>

          </div>

        ) : (

          <div className="membership-table-wrapper">

            <table className="membership-table">

              <thead>

                <tr>
                  <th>
                    Member
                  </th>

                  <th>
                    Age
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Present Location
                  </th>

                  <th>
                    Residential Address
                  </th>

                  <th>
                    School
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Registered
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredMembers.map(
                  (member) => (

                    <tr
                      key={
                        member.id
                      }
                    >

                      <td>

                        <div className="membership-member">

                          <div className="membership-avatar">

                            {member.profile_image_url ? (

                              <img
                                src={
                                  member.profile_image_url
                                }
                                alt={
                                  member.full_name
                                }
                              />

                            ) : (

                              <span>
                                {member.full_name
                                  ?.charAt(
                                    0
                                  )
                                  .toUpperCase() ||
                                  "M"}
                              </span>

                            )}

                          </div>

                          <div>

                            <strong>
                              {
                                member.full_name
                              }
                            </strong>

                            <small>
                              {
                                member.email
                              }
                            </small>

                          </div>

                        </div>

                      </td>

                      <td>
                        {member.age ||
                          "Not provided"}
                      </td>

                      <td>
                        {member.phone ||
                          "Not provided"}
                      </td>

                      <td>
                        {member.location ||
                          "Not provided"}
                      </td>

                      <td>
                        {member.address ||
                          "Not provided"}
                      </td>

                      <td>
                        {member.school ||
                          "Not provided"}
                      </td>

                      <td>

                        <span
                          className={`membership-status ${
                            member.status ===
                            "active"
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
                              openEditMember(
                                member
                              )
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
                              {updating ===
                              member.id
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
                              {updating ===
                              member.id
                                ? "..."
                                : "Deactivate"}
                            </button>

                          )}

                          <button
                            type="button"
                            className="membership-delete-button"
                            disabled={
                              deleting ===
                              member.id
                            }
                            onClick={() =>
                              handleDeleteMember(
                                member
                              )
                            }
                          >
                            {deleting ===
                            member.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
};

export default Membership;