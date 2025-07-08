import React, { useState, useEffect } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const Home = () => {
	const [usersCount, setUsersCount] = useState([]);
	const [users, setUsers] = useState([]);


	useEffect(() => {
		async function countUsers() {
			try {
				console.log("====================================");
				console.log("Fetching user count from:", `${SERVER_URL}/users/public`);
				console.log("====================================");
				const response = await fetch(`${SERVER_URL}/users/public`);
				const data = await response.json();
				setUsersCount(data.utilisateurs.length);
				setUsers(data.utilisateurs);

			} catch (error) {
				console.error("Error fetching user count:", error);
			}
		}
		countUsers();
	}, []);
	return (
		<header className='App-header'>
			<h1>Users manager</h1>
			<p>Total users: {usersCount}</p>
						<ul>
				{users.map((user) => (
					<li key={user.id}>{user.username}</li>
				))}
			</ul>
		</header>
	);
};
