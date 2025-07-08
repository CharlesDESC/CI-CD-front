import React, { useState } from "react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const RegisterForm = ({ onSubmit }) => {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		is_admin: false,
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (onSubmit) {
			await onSubmit(form);
			setForm({ username: "", email: "", password: "" });
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`${SERVER_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(
					"Erreur lors de l'inscription : " +
						(errorData.message || response.statusText)
				);
			} else {
				alert("Inscription réussie !");
				setForm({ username: "", email: "", password: "" });
			}
		} catch (error) {
			alert("Erreur réseau : " + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>
					Username:
					<input
						type='text'
						name='username'
						value={form.username}
						onChange={handleChange}
						required
						autoComplete='username'
						disabled={loading}
					/>
				</label>
			</div>
			<div>
				<label>
					Email:
					<input
						type='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						required
						autoComplete='email'
						disabled={loading}
					/>
				</label>
			</div>
			<div>
				<label>
					Password:
					<input
						type='password'
						name='password'
						value={form.password}
						onChange={handleChange}
						required
						autoComplete='new-password'
						disabled={loading}
					/>
				</label>
			</div>
			<button type='submit' disabled={loading}>
				{loading ? "En cours..." : "Register"}
			</button>
		</form>
	);
};
