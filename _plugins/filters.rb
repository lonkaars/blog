module Filters
	def datefmt(input)
		return input.strftime("%F")
	end

	def sentence_join(items)
		return "" if items == nil or items.length == 0
		return "#{items[0]}" if items.length == 1
		return "#{items[0..-2].join(", ")} and #{items[-1]}"
	end
end

Liquid::Template.register_filter(Filters)

