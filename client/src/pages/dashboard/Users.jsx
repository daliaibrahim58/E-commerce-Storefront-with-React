import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaUserPlus, FaTimes } from "react-icons/fa";
import { API_URLS } from "../../api/config";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    userName: "",
    email: "",
    role: "client",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const API_URL = API_URLS.USERS;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      var usersData = [];
      if (Array.isArray(res.data)) {
        usersData = res.data;
      } else if (res.data && res.data.users) {
        usersData = res.data.users;
      } else if (res.data && res.data.data) {
        usersData = res.data.data;
      }

      const normalized = usersData.map(function (u, idx) {
        return {
          id: u.id || u._id || idx,
          userName: u.userName || u.name || u.username || "",
          email: u.email || "",
          role: u.role || (u.isAdmin ? "admin" : "client") || "client",
          raw: u,
        };
      });

      setUsers(normalized);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(function () {
    fetchUsers();
  }, []);

  const handleDelete = async function (id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(API_URL + "/" + id);
        setUsers(
          users.filter(function (u) {
            return u.id !== id;
          })
        );
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  const handleAdd = function () {
    setIsEditing(false);
    setCurrentUser({ userName: "", email: "", role: "client", password: "" });
    setIsModalOpen(true);
  };

  const handleEdit = function (user) {
    setIsEditing(true);
    // don't prefill password when editing
    var u = Object.assign({}, user);
    u.password = "";
    setCurrentUser(u);
    setIsModalOpen(true);
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    // client-side validation
    var validationErrors = {};
    if (!currentUser.userName || currentUser.userName.trim().length < 2) {
      validationErrors.userName = "Name must be at least 2 characters";
    }
    var emailRe = /^\S+@\S+\.\S+$/;
    if (!currentUser.email || !emailRe.test(currentUser.email)) {
      validationErrors.email = "Enter a valid email address";
    }
    if (currentUser.role !== "client" && currentUser.role !== "admin") {
      validationErrors.role = "Role must be client or admin";
    }

    // password required when creating a user and must be at least 6 chars and capital letter
    if (!isEditing) {
      if (
        !currentUser.password ||
        (currentUser.password.length < 6 && !/[A-Z]/.test(currentUser.password))
      ) {
        validationErrors.password =
          "Password must be at least 6 characters and contain a capital letter";
      }
    } else {
      // when editing, if password provided enforce min length
      if (
        currentUser.password &&
        currentUser.password.length > 0 &&
        currentUser.password.length < 6
      ) {
        validationErrors.password = "Password must be at least 6 characters";
      }
    }

    // duplicate email check
    var duplicate = users.some(function (u) {
      return u.email === currentUser.email && u.id !== currentUser.id;
    });
    if (duplicate) {
      validationErrors.email = "This email is already registered";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      var payload = {
        name: currentUser.userName,
        email: currentUser.email,
        role: currentUser.role,
      };

      // include password when present (required for new user creation)
      if (currentUser.password && currentUser.password.length > 0) {
        payload.password = currentUser.password;
      }

      if (isEditing) {
        var putRes = await axios.put(API_URL + "/" + currentUser.id, payload);
        var updated = {
          id: putRes.data.id || putRes.data._id || currentUser.id,
          userName:
            putRes.data.userName || putRes.data.name || currentUser.userName,
          email: putRes.data.email || currentUser.email,
          role: putRes.data.role || currentUser.role,
        };
        setUsers(
          users.map(function (u) {
            return u.id === currentUser.id ? updated : u;
          })
        );
      } else {
        // Choose creation endpoint by requested role:
        // - If creating an admin, use REGISTER_ADMIN when available.
        // - Otherwise prefer the standard REGISTER endpoint, then fallback to USERS.
        var createUrl = API_URL;
        if (payload.role === "admin") {
          createUrl = API_URLS.REGISTER_ADMIN || API_URL;
        } else {
          createUrl = API_URLS.REGISTER || API_URL;
        }
        var postRes = await axios.post(createUrl, payload);
        var created = {
          id:
            postRes.data.id ||
            postRes.data._id ||
            Math.random().toString(36).substring(2, 9),
          userName:
            postRes.data.userName || postRes.data.name || currentUser.userName,
          email: postRes.data.email || currentUser.email,
          role: postRes.data.role || currentUser.role,
        };
        setUsers(users.concat(created));
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving user:", err);
      var msg =
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        String(err);
      alert("Failed to save user: " + msg);
    }
  };

  var handleChange = function (e) {
    var name = e.target.name;
    var value = e.target.value;
    // clear field error when user types
    setErrors(Object.assign({}, errors, { [name]: undefined }));
    setCurrentUser(Object.assign({}, currentUser, { [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Users Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaUserPlus />
          <span>Add User</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">#</th>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {users.map(function (user, idx) {
              return (
                <tr
                  key={user.id || user.email || idx}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border-b">{idx + 1}</td>
                  <td className="p-4 border-b font-medium">{user.userName}</td>
                  <td className="p-4 border-b">{user.email}</td>
                  <td className="p-4 border-b">
                    <span
                      className={
                        "px-2 py-1 rounded-full text-xs font-semibold " +
                        (user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700")
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 border-b text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={function () {
                          handleEdit(user);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={function () {
                          handleDelete(user.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Edit User" : "Add User"}
              </h3>
              <button
                onClick={function () {
                  setIsModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
                )}
                <input
                  type="text"
                  name="userName"
                  value={currentUser.userName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <input
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              {!isEditing && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                  <input
                    type="password"
                    name="password"
                    value={currentUser.password || ""}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={!isEditing}
                    placeholder={
                      isEditing
                        ? "Leave empty to keep current password"
                        : "Choose a password"
                    }
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={currentUser.role}
                  onChange={handleChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={function () {
                    setIsModalOpen(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
