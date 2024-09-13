const ListenerNamePattern = /^[a-z\dあ-ん\-]{3,255}$/i

export const ValidateListenerName = {
	required: true,
	pattern: {
		value: ListenerNamePattern,
		message: "※英数字かな、+-で3文字以上必要です。"
	}
}

const EmailPattern = /^[\w.\-]+@[\w\-]+\.[\w.\-]+$/i

export const ValidateEmail = {
	required: true,
	pattern: {
		value: EmailPattern,
		message: "※emailの形式で入力してください。"
	}
}

const PasswordPattern = /^[a-z\d\-]{4,255}$/i

export const ValidatePassword = {
	required: true,
	pattern: {
		value: PasswordPattern,
		message: "※英数字、+-で4文字以上必要です"
	}
}
