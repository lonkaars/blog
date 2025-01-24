module Meta
	class Generator < Jekyll::Generator
		def generate(site)
			# convert yaml @0123456789 (unix timestamps) into ruby Date
			site.data = parse_unix_dates(site.data)

			for page in site.collections['items'] do
				# directly add generated page metadata to `page.meta` in liquid
				page.data['meta'] = site.data['post'][page.slug]

				# set page.authors to author metadata from git+yaml
				page.data['authors'] = site.data['authors'].filter { |author|
					author['git'].intersect?(page.data['meta']['authors'])
				}

				# set page.date to generated date_initial
				page.data['date'] = page.data['meta']['date_initial']
			end
		end

		def parse_unix_dates(data)
			for key, value in data do
				if value.is_a? Hash
					data[key] = parse_unix_dates(value)
					next
				end
				
				next unless value.is_a? String
				next unless value =~ /^@\d+$/
				data[key] = Time.at(Integer(value[1..]))
			end
			return data
		end
	end
end

