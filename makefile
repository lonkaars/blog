JEKYLL_ENV ?= development
# JEKYLL_ENV ?= production

WEBROOT ?= _site

JEKYLL_BUILD_ARGS += --quiet
JEKYLL_BUILD_ARGS += --destination $(WEBROOT)

# Gemfile.lock is used as a proxy for checking if the required gems are
# installed

build: Gemfile.lock
	bundle exec jekyll build $(JEKYLL_BUILD_ARGS)

Gemfile.lock: Gemfile
	bundle install --quiet

clean:
	$(RM) -r $(WEBROOT)

