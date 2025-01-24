require 'set'

module Jekyll
	class FormatAuthors < Liquid::Tag
		def initialize(tag_name, input, tokens)
			super
			@args = input.split(" ").map { |arg| arg.strip() }
		end

		def transform_authors(author_meta, git_authors)
			authors = Set[]
			for substitute in author_meta do
				for name in substitute['git'] do
					if git_authors.include?(name)
						authors.add(substitute['name'])
					end
				end
			end
			return authors.to_a()
		end

		def join_names(authors)
			return "nobody?" if authors.length == 0
			return "#{authors[0]}" if authors.length == 1
			return "#{authors[0..-2].join(", ")} and #{authors[-1]}"
		end

		def render(context)
			author_meta = context[@args[0]]
			git_authors = context[@args[1]]
			authors = transform_authors(author_meta, git_authors)
			return join_names(authors)
		end
	end
end

Liquid::Template.register_tag('fmt_authors', Jekyll::FormatAuthors)

