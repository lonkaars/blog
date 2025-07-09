class I18N < Liquid::Tag
	def initialize(tag_name, text, tokens)
		super
		@key = text.strip()
	end

	def render(context)
		# see _data/i18n.yml
		db = context.registers[:site].data['i18n']
		lang = context.registers[:page]['lang']

		entry = db[@key]
		return @key if entry == nil

		# first translation is the preferred translation
		translation = entry.values[0]
		# return key as-is if the entry is an empty map
		return @key if translation == nil
		# return the correct translation if it is in the entry
		return entry[lang] if entry.key?(lang)
		# else, return the first translation
		return translation
	end
end

Liquid::Template.register_tag('i18n', I18N)
