module Filters
	def datefmt(input)
		return input.strftime("%F")
	end

	def sentence_join(items, fallback = "")
		return fallback if items == nil or items.length == 0
		return "#{items[0]}" if items.length == 1
		return "#{items[0..-2].join(", ")} and #{items[-1]}"
	end

	def plural(num, counter)
		return "#{num} #{counter}#{num == 1 ? '' : 's'}"
	end

	def post_sort(posts, sort_by)
		# date (reverse chronological)
		return posts.sort_by{ |post| -post.data['date'].to_i } if sort_by == "date"
		# title (case insensitive)
		return posts.sort_by{ |post| post.data['title'].downcase } if sort_by == "title"
	end
end

Liquid::Template.register_filter(Filters)

