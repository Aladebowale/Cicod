import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AxiosCicod = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const login = { 
    name: name,
    email: email
  };

  const URL = 'https://dev.konn3ct.ng/api/app/kv4/validate-meeting';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(URL,{"name":"standupmeet"})
        setUsers(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(URL, login);
    } catch (e) {
      console.log(e);
    }
  };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${URL}/${id}`);
//       setUsers(users.filter(user => user.id !== id));  
//     } catch (e) {
//       console.log(e);
//     }
//   };


  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Name</th>
            <th>Email</th>
            
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td> */}
              
              {/* <td>
                <button>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td> */}
            {/* </tr> */}
          {/* ))} */}
        </tbody>
      </table>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <br />
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default AxiosCicod;