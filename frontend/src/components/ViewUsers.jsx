



import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './ViewUsers.css';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [editemail, setEditemail] = useState(null);
    const [edituser, setEdituser] = useState({ name: '', role: '' });
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'student',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("https://userapp6.onrender.com/users");
            setUsers(res.data);
        } catch (err) {
            console.log("Users Fetching Error", err.message);
            setError('Failed to fetch users. Please try again.');
        }
    };

    const handleDelete = async (email) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                await axios.delete(`https://userapp6.onrender.com/removeuser/${email}`);
                alert("User deleted successfully");
                fetchUsers();
            } catch (err) {
                console.log("User Deleting Error", err.message);
                setError('Failed to delete user. Please try again.');
            }
        }
    };

    const handleAdd = async () => {
        if (!newUser.name || !newUser.email) {
            setError('Name and Email are required.');
            return;
        }
        try {
            await axios.post("https://userapp6.onrender.com/adduser", newUser);
            alert("User added successfully");
            setNewUser({ name: '', email: '', role: 'student' });
            setError(null);
            fetchUsers();
        } catch (err) {
            console.log("User Creation Error", err.message);
            setError('Failed to add user. Please try again.');
        }
    };

    const handleEdit = (email) => {
        const userToEdit = users.find((user) => user.email === email);
        if (userToEdit) {
            setEdituser({ name: userToEdit.name, role: userToEdit.role });
        }
        setEditemail(email);
    };

    const handleCancel = () => {
        setEditemail(null);
    };

    const handleSave = async (email) => {
        try {
            await axios.put(`https://userapp6.onrender.com/updateuser/${email}`, edituser);
            alert("User updated successfully");
            setEditemail(null);
            setEdituser({ name: '', role: '' });
            fetchUsers();
        } catch (err) {
            console.log("User Editing Error", err.message);
            setError('Failed to edit user. Please try again.');
        }
    };

    return (
        <div className='view-users-container'>
            <h2 className='header'>User Management</h2>

            <div className='add-user-section'>
                <input
                    type='email'
                    className='input'
                    placeholder='User Email'
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    type='text'
                    className='input'
                    placeholder='User Name'
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <select
                    className='select'
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value='admin'>Admin</option>
                    <option value='teacher'>Teacher</option>
                    <option value='student'>Student</option>
                </select>
                <button className='btn btn-add' onClick={handleAdd}>Add User</button>
            </div>

            {error && <div className='error-message'>{error}</div>}

            <table className='users-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.email}>
                            <td>{index + 1}</td>
                            <td>{user.email}</td>
                            <td>
                                {editemail === user.email ? (
                                    <input
                                        type='text'
                                        className='input'
                                        value={edituser.name}
                                        onChange={(e) => setEdituser({ ...edituser, name: e.target.value })}
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>
                            <td>
                                {editemail === user.email ? (
                                    <select
                                        className='select'
                                        value={edituser.role}
                                        onChange={(e) => setEdituser({ ...edituser, role: e.target.value })}
                                    >
                                        <option value='admin'>Admin</option>
                                        <option value='teacher'>Teacher</option>
                                        <option value='student'>Student</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>
                                {editemail === user.email ? (
                                    <>
                                        <button
                                            className='btn btn-save'
                                            onClick={() => handleSave(user.email)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className='btn btn-cancel'
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className='btn btn-edit'
                                            onClick={() => handleEdit(user.email)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className='btn btn-delete'
                                            onClick={() => handleDelete(user.email)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewUsers;