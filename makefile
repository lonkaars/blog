JEKYLL_ENV ?= development
# JEKYLL_ENV ?= production

WEBROOT ?= _site

JEKYLL_BUILD_ARGS += --quiet
JEKYLL_BUILD_ARGS += --destination $(WEBROOT)

# Gemfile.lock is used as a proxy for checking if the required gems are
# installed
GEMS = Gemfile.lock

build: $(GEMS)
	bundle exec jekyll build $(JEKYLL_BUILD_ARGS)

$(GEMS): Gemfile
	bundle install --quiet

clean:
	$(RM) -r $(WEBROOT)

