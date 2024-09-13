import React from "react"

import { Layout } from "@/components/layout/Layout"
import { SignupForm } from "@/components/form/User"

const pageName = "Sign up"

export function Signup() {
	return (
		<Layout pageName={pageName} isSignin={false}>
			<div className="flex justify-center mt-6">
				<div className="w-full max-w-md">
					<SignupForm />
				</div>
			</div>
		</Layout>
	)
}

export default Signup
