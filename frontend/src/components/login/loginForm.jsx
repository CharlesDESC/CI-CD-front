import React, { useState } from "react";
import DisplayInfo from "../displayInfo/displayInfo";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch(`${SERVER_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.detail || "Erreur de connexion");
			}

			const data = await response.json();
			localStorage.setItem("jwt", data.access_token);
			const decodedPayload = JSON.parse(atob(data.access_token.split('.')[1]));
			if (decodedPayload.is_admin) {
				setIsAdmin(true);
			} else {
				setError("Vous devez être admin pour accéder à cette page.");
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (!isAdmin) {
		return (
			<div>
				<h2>Connexion Admin requise</h2>
				<form onSubmit={handleLogin} className="card">
					<div>
						<label>
							Nom d'utilisateur :
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								disabled={loading}
							/>
						</label>
					</div>
					<div>
						<label>
							Mot de passe :
							<input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={loading}
							/>
						</label>
					</div>
					<button type='submit' disabled={loading}>
						{loading ? "Connexion..." : "Se connecter"}
					</button>
				</form>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</div>
		);
	}
	return <DisplayInfo />;
};

export default LoginForm;