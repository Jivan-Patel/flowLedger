export const generateWhatsAppLink = (phone, text) => {
	const cleanedPhone = phone.replace(/\D/g, '')
	const encodedText = encodeURIComponent(text)
	return `https://wa.me/${cleanedPhone}?text=${encodedText}`
}
