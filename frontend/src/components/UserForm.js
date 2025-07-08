import React, { useState } from 'react';

function UserForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    city: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la connexion');
      }
    
      const data = await response.json();
      const token = data.token;
      // Stocker le token dans le localStorage ou un autre endroit sécurisé
      localStorage.setItem('authToken', token);
      console.log('Connexion réussie, token:', token);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
          city: formData.city,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'utilisateur');
      }

      alert('Utilisateur créé avec succès');
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        placeholder="Prénom"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Nom"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="birthDate"
        placeholder="Date de naissance"
        value={formData.birthDate}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="Ville"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <button type="submit">Soumettre</button>
      <button type="button" onClick={handleRegister}>Créer un compte</button>
    </form>
  );
}

export default UserForm; 