import React, { useEffect, useState } from "react";
import "../styles/users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch("http://localhost:8000/users/") // Adjust API URL if needed
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/users/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setUsers(users.filter(user => user.id !== userId)); // Update state to remove deleted user
            } else {
                const data = await response.json();
                alert(`Error: ${data.detail}`);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <aside className="side-panel">
                {/* Sidebar content placeholder */}
            </aside>

            <main className="admin-main">
                <h2 className="admin-title">Registered Users</h2>
                {loading ? (
                    <p className="loading-text">Loading users...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Verified</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.verified ? "✅" : "❌"}</td>
                                    <td>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            ❌ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default Users;
