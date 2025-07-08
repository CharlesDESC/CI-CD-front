import React, { useState, useEffect } from "react";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const DisplayInfo = () => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");

	const fetchUsers = async () => {
		try {
			const usersResponse = await fetch(`${SERVER_URL}/users/private`, {
				headers: {
					"X-Admin": "true",
				},
			});
			if (!usersResponse.ok) {
				throw new Error("Impossible de récupérer la liste des utilisateurs");
			}
			const usersData = await usersResponse.json();
			setUsers(usersData.utilisateurs);
			setError("");
		} catch (err) {
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (userId) => {
		if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
			return;

		try {
			const response = await fetch(`${SERVER_URL}/users/${userId}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				const data = await response.json();
				alert(`Erreur: ${data.detail || data.message || response.statusText}`);
				return;
			}
			alert("Utilisateur supprimé !");
			fetchUsers();
		} catch (error) {
			alert("Erreur réseau ou serveur");
			console.error(error);
		}
	};

	return (
		<div>
			<h2>Liste complète des utilisateurs</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{users.length === 0 ? (
				<p>Aucun utilisateur trouvé.</p>
			) : (
				users.map((user) => (
					<div key={user[0]}>
						ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Admin:{" "}
						{user[3] ? "Oui" : "Non"}{" "}
						<button onClick={() => handleDelete(user[0])}>delete</button>
					</div>
				))
			)}
		</div>
	);
};
