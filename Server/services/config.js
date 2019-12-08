module.exports = {
	signOption: {
		algorithm: "RS256",
		expiresIn: "12h",
		issuer: "authorization server",
		subject:"lcv",
		audience:"lcv"
	},
	verifyOption: {
		algorithms: ["RS256"],
		issuer:"authorization server",
		subject: "lcv",
		audience: "lcv"
	}
}