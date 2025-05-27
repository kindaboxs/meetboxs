"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function HomePage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { data: session } = authClient.useSession();

	const onSubmit = async () => {
		await authClient.signUp.email(
			{
				name,
				email,
				password,
			},
			{
				onError: (ctx) => {
					console.log(ctx);
					window.alert(ctx.error.message);
				},
				onSuccess: (ctx) => {
					console.log(ctx);
					window.alert("Success, Signup");
				},
			}
		);
	};

	const onSignIn = async () => {
		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onError: (ctx) => {
					console.log(ctx);
					window.alert(ctx.error.message);
				},
				onSuccess: (ctx) => {
					console.log(ctx);
					window.alert("Success, Signin");
				},
			}
		);
	};

	if (session) {
		return (
			<div className="flex flex-col gap-y-4 p-4">
				<p>Logged In as {session.user.email}</p>
				<Button onClick={() => authClient.signOut()}>Sign Out</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-10">
			<div className="flex flex-col gap-y-4 p-4">
				<Input
					placeholder="Name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Input
					placeholder="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type="submit" onClick={onSubmit}>
					Sign Up
				</Button>
			</div>
			<div className="flex flex-col gap-y-4 p-4">
				<Input
					placeholder="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					placeholder="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button type="submit" onClick={onSignIn}>
					Sign In
				</Button>
			</div>
		</div>
	);
}
