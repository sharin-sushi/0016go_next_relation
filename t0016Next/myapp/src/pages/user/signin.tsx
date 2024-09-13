import React from "react"

import { Layout } from "@/components/layout/Layout"
import { SigninForm } from "@/components/form/User"

export function SigninPage() {
	const pageName = "Login"

	return (
		<Layout pageName={pageName} isSignin={false}>
			<div className="flex justify-center mt-6">
				<div className="w-full max-w-md">
					<SigninForm />
				</div>
			</div>
		</Layout>
	)
}

export default SigninPage
