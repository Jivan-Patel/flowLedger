export const generateWhatsAppLink = (phone, text) => {
	let cleanedPhone = phone.replace(/\D/g, '')
	if (cleanedPhone.length === 10) {
		cleanedPhone = '91' + cleanedPhone
	}
	const encodedText = encodeURIComponent(text)
	return `https://wa.me/${cleanedPhone}?text=${encodedText}`
}
