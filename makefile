.PHONY: FORCE

JEKYLL_ENV ?= development
# JEKYLL_ENV ?= production

WEBROOT ?= _site

JEKYLL_BUILD_ARGS += --quiet
JEKYLL_BUILD_ARGS += --destination $(WEBROOT)

# Gemfile.lock is used as a proxy for checking if the required gems are
# installed
GEMS = Gemfile.lock

POSTS := $(wildcard _items/*)
POST_META := $(patsubst _items/%.md,_data/post/%.yml,$(POSTS))

build: $(GEMS) $(POST_META) FORCE
	bundle exec jekyll build $(JEKYLL_BUILD_ARGS)

$(GEMS): Gemfile
	bundle install --quiet

_data/post/%.yml: _items/%.md
	@mkdir -p _data/post
	_scripts/postinfo $< > $@

clean: FORCE
	$(RM) -r $(WEBROOT)

