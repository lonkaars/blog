module DateFormatter
	def datefmt(input)
		return input.strftime("%F")
	end
end

Liquid::Template.register_filter(DateFormatter)

