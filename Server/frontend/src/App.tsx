import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "@/pages/Login";
import { AuthGate } from "@/components/AuthGate";
import { HomeRedirect } from "@/components/HomeRedirect";
import { Dashboard } from "@/pages/Dashboard";
import { PublicRoute } from "@/components/PublicRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function App() {
	return (
		<BrowserRouter>
			<AuthGate>
				<Routes>
					<Route path="/" element={<HomeRedirect />} />

					<Route path="/login" element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}/>
					<Route path="/dashboard" element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}/>
				</Routes>
			</AuthGate>
		</BrowserRouter>

	);
};
