import CryptoJS from 'crypto-js'

// XSS 防护：转义 HTML 特殊字符
export const escapeHtml = (str: string): string => {
	const htmlEntities: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
	}
	return str.replace(/[&<>"']/g, (char) => htmlEntities[char])
}

// CSRF Token 生成
export const generateCSRFToken = (): string => {
	return CryptoJS.lib.WordArray.random(16).toString()
}

// 敏感数据加密
export const encryptData = (data: string, key: string): string => {
	return CryptoJS.AES.encrypt(data, key).toString()
}

// 敏感数据解密
export const decryptData = (encryptedData: string, key: string): string => {
	const bytes = CryptoJS.AES.decrypt(encryptedData, key)
	return bytes.toString(CryptoJS.enc.Utf8)
}

// 密码强度检查
export const checkPasswordStrength = (
	password: string,
): {
	score: number
	feedback: string
} => {
	let score = 0
	const feedback: string[] = []

	// 长度检查
	if (password.length >= 8) {
		score += 1
	} else {
		feedback.push('密码长度至少需要8个字符')
	}

	// 包含数字
	if (/\d/.test(password)) {
		score += 1
	} else {
		feedback.push('密码需要包含数字')
	}

	// 包含小写字母
	if (/[a-z]/.test(password)) {
		score += 1
	} else {
		feedback.push('密码需要包含小写字母')
	}

	// 包含大写字母
	if (/[A-Z]/.test(password)) {
		score += 1
	} else {
		feedback.push('密码需要包含大写字母')
	}

	// 包含特殊字符
	if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		score += 1
	} else {
		feedback.push('密码需要包含特殊字符')
	}

	return {
		score,
		feedback: feedback.join('; '),
	}
}

// 安全的 JSON 解析
export const safeJSONParse = <T>(str: string, fallback: T): T => {
	try {
		return JSON.parse(str) as T
	} catch (e) {
		console.error('JSON parse error:', e)
		return fallback
	}
}

// 安全的 URL 参数解析
export const safeURLParams = (url: string): URLSearchParams => {
	try {
		return new URLSearchParams(url)
	} catch (e) {
		console.error('URL params parse error:', e)
		return new URLSearchParams()
	}
}
