require 'nokogiri'

module Jekyll
	class TOC < Liquid::Tag
		def render context
			# load HTML into nokogiri
			html = context.registers[:page]['content']
			doc = Nokogiri::HTML(html)

			# enumerate over all h1-4 headings
			@els = doc.css("h1, h2, h3, h4")
			return '<div class="chapterChildren">%s</div>' % [ output_toc ]
		end

		def output_toc
			# empty toc (this check prevents crash)
			return "" if @els.length == 0

			output = '<ul>'

			current_level = el_level(@els[0])

			while @els.length > 0
				el = @els[0]
				el_next = @els[1]
				level = el_level(el)
				level_next = el_level(el_next || el) # || el to prevent crash on end of list

				if level >= level_next
					output += '<li>'
				else
					output += '<li class="stub"><details open>'
					output += '<summary>'
				end

				output += '<a href="#%s">%s</a>' % [ el['id'], el.inner_html ]
				@els.shift()

				if level >= level_next
					output += '</li>'
				else
					output += '</summary>'
					output += output_toc
					output += '</details></li>'
				end

				break if level_next < level
			end

			output += '</ul>'

			return output
		end

		def el_level el
			return Integer(el.name[1..])
		end
	end
end

Liquid::Template.register_tag('toc', Jekyll::TOC)

