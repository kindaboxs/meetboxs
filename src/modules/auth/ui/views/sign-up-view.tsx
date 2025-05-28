"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { z } from "zod";

import { BoxsIcon } from "@/components/icons/boxs-icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z
	.object({
		name: z.string().min(1, {
			message: "Name is required",
		}),
		email: z.string().email({ message: "Email is invalid" }),
		password: z.string().min(1, {
			message: "Password is required",
		}),
		confirmPassword: z.string().min(1, {
			message: "Confirm Password is required",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type formSchemaType = z.infer<typeof formSchema>;

export const SignUpView = () => {
	const [pending, setPending] = useState<boolean>(false);
	const [providerPending, setProviderPending] = useState<
		"google" | "github" | null
	>(null);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmitForm = async (data: formSchemaType) => {
		await authClient.signUp.email(
			{
				name: data.name,
				email: data.email,
				password: data.password,
			},
			{
				onRequest: () => {
					setError(null);
					setPending(true);
				},
				onSuccess: () => {
					setError(null);
					setPending(false);
					router.push("/");
				},
				onError: (ctx) => {
					setPending(false);
					setError(ctx.error.message);
				},
			}
		);
	};

	const onSocialSignIn = async (provider: "github" | "google") => {
		await authClient.signIn.social(
			{
				provider: provider,
				callbackURL: "/",
			},
			{
				onRequest: () => {
					setError(null);
					setProviderPending(provider);
				},
				onSuccess: () => {
					setError(null);
					setProviderPending(null);
				},
				onError: (ctx) => {
					setError(ctx.error.message);
					setProviderPending(null);
				},
			}
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitForm)}
							className="p-6 md:p-8"
						>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">
										Let&apos;s get started!
									</h1>
									<p className="text-muted-foreground text-balance">
										Create your account
									</p>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														type="name"
														placeholder="Your Name"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="user@example.com"
														autoComplete="email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="********"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-3">
									<FormField
										control={form.control}
										name="confirmPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="********"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{!!error && (
									<Alert
										variant="destructive"
										className="bg-destructive/10 border-destructive"
									>
										<OctagonAlertIcon className="!text-destructive size-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
								<Button type="submit" className="w-full" disabled={pending}>
									Sign Up
								</Button>
								<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-card text-muted-foreground relative z-10 px-2">
										or continue with
									</span>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<Button
										variant="outline"
										type="button"
										className="w-full"
										onClick={() => onSocialSignIn("github")}
										disabled={providerPending === "github"}
									>
										<FaGithub />
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
										onClick={() => onSocialSignIn("google")}
										disabled={providerPending === "google"}
									>
										<FaGoogle />
									</Button>
								</div>
								<p className="text-center text-sm">
									Already have an account?{" "}
									<Link
										href="/sign-in"
										className="underline-offset-4 hover:underline"
									>
										Sign In
									</Link>
								</p>
							</div>
						</form>
					</Form>

					<div className="relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-sky-700 to-sky-900 md:flex">
						<BoxsIcon className="size-22 text-sky-400" />
						<p className="text-background text-2xl font-bold">MeetBoxs</p>
					</div>
				</CardContent>
			</Card>

			<div className="text-muted-foreground flex items-center justify-center text-center">
				<p className="text-muted-foreground text-sm">
					By continuing, you agree to our{" "}
					<Link
						href="#"
						className="text-primary font-medium underline-offset-4 hover:underline"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="#"
						className="text-primary font-medium underline-offset-4 hover:underline"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</div>
	);
};
