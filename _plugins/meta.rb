class Meta < Jekyll::Generator
	def generate(site)
		# convert yaml @0123456789 (unix timestamps) into ruby Date
		site.data = parse_unix_dates(site.data)

		for page in site.collections['items'] do
			# convert generated page metadata and add directly to `page.meta` in liquid
			page.data['meta'] = transform_data(site, page.slug)

			# set page.authors to author metadata from git+yaml
			page.data['authors'] = site.data['authors'].filter do |author|
				author['git'].intersect?(page.data['meta']['authors'])
			end

			# set page.date to generated date_initial
			page.data['date'] = page.data['meta']['date']
		end
	end

	def parse_unix_dates(data)
		# recurse deeper
		return data.transform_values { |val| parse_unix_dates(val) } if data.is_a? Hash
		return data.map { |val| parse_unix_dates(val) } if data.is_a? Array

		# convert strings matching regex
		return Time.at(Integer(data[1..])) if data.is_a? String and data =~ /^@\d+$/

		# base case
		return data
	end

	def transform_data(site, slug)
		data = site.data['post'][slug]
		data['git_log'] = data['git_log'].sort { |c| c['date'].to_i }

		git_log = data['git_log'].filter do |commit|
			!site.data['git']['ignore_commits'].include?(commit['hash'])
		end

		data['authors'] = git_log.map{ |c| c['author'] }.uniq
		data['date_initial'] = git_log.first['date']
		data['date'] = git_log.last['date']
		data['edits'] = git_log.length - 1 # original commit is not an edit
		return data
	end
end
