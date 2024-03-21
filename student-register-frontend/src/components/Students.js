import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from 'apollo-boost';

const GET_STUDENTS = gql`
  query {
    students {
      id
      firstName
      lastName
      age
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    delete(id: $id) {
      id
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $firstName: String, $lastName: String, $age: Int) {
    update(id: $id, firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent($firstName: String!, $lastName: String!, $age: Int!) {
    create(firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const Students = () => {
  const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
  const [deleteStudent] = useMutation(DELETE_STUDENT);
  const [updateStudent] = useMutation(UPDATE_STUDENT);
  const [createStudent] = useMutation(CREATE_STUDENT);
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({ firstName: '', lastName: '', age: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', age: '' });

  const handleDelete = async (id) => {
    try {
      await deleteStudent({ variables: { id } });
      // Refetch data after deletion
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id, student) => {
    setEditingId(id);
    setEditedValues({
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age.toString(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedValues({ ...editedValues, [name]: value });
  };

  const handleSubmit = async (id) => {
    try {
      await updateStudent({
        variables: {
          id,
          firstName: editedValues.firstName,
          lastName: editedValues.lastName,
          age: parseInt(editedValues.age),
        },
      });
      // Refetch data after update
      refetch();
      // Clear editingId after update
      setEditingId(null);
      // Clear editedValues
      setEditedValues({ firstName: '', lastName: '', age: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await createStudent({
        variables: {
          firstName: newStudent.firstName,
          lastName: newStudent.lastName,
          age: parseInt(newStudent.age),
        },
      });
      // Refetch data after creation
      refetch();
      // Clear newStudent values
      setNewStudent({ firstName: '', lastName: '', age: '' });
      // Close the create form
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Students</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowCreateForm(true)}>
        Create
      </button>
      {showCreateForm && (
        <div className="mb-3">
          <h3>Create new student</h3>
          <input
            type="text"
            placeholder="First Name"
            value={newStudent.firstName}
            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newStudent.lastName}
            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={newStudent.age}
            onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
          />
          <button className="btn btn-success ml-2" onClick={handleCreate}>
            Submit
          </button>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Age</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.students.map(student => (
            <tr key={student.id}>
              <td>
                {editingId === student.id ? (
                  <input
                    type="text"
                    value={editedValues.firstName}
                    name="firstName"
                    onChange={handleChange}
                  />
                ) : (
                  student.firstName
                )}
              </td>
              <td>
                {editingId === student.id ? (
                  <input
                    type="text"
                    value={editedValues.lastName}
                    name="lastName"
                    onChange={handleChange}
                  />
                ) : (
                  student.lastName
                )}
              </td>
              <td>
                {editingId === student.id ? (
                  <input
                    type="number"
                    value={editedValues.age}
                    name="age"
                    onChange={handleChange}
                  />
                ) : (
                  student.age
                )}
              </td>
              <td>
                {editingId === student.id ? (
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => handleSubmit(student.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm mr-2"
                    onClick={() => handleEdit(student.id, student)}
                  >
                    Updata
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;

