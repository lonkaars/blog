---
title: My git setup
subtitle: How I use git on my server
tags:
    - git
    - server
    - software
---

# Overview

I have two mechanisms set up for accessing [my git
server](https://git.pipeframe.xyz):

1. **gitolite** for ssh access and permission management
2. **cgit** for browsing and read-only access over HTTP

# SSH Access with gitolite

Gitolite was a pain in the ass to set up because I didn't understand umasks
before I started trying to set it up. A *umask* is like the "opposite" of what
you'd enter when running `chmod`. For example: if I run `touch test`, I will
now have a file with the same permissions as `chmod 644` (though the default
umask may vary per distro). You can check this with the `stat` command:

```sh
$ touch test
$ stat test
  File: test
  (bla bla)
Access: (0644/-rw-r--r--)  Uid: ( 1000/	loek)   Gid: (  985/   users)
```

The 9 least significant bits in the 'Access' field contain flags that represent
the file's permissions. This value is usually displayed using octal notation
(0-7) because this neatly groups each 3-bit pair in a single digit:

||user|group|world|
|-:|:-:|:-:|:-:|
|flags|`rw-`|`r--`|`r--`|
|binary|`110`|`100`|`100`|
|octal|`6`|`4`|`4`|

The umask very literally *masks* each bit (using a bitwise and operation). If I want gitolite to create
repositories with default permissions so other users can read but not write, I
have to use a mode with the bits set of the permissions that I *don't* want to grant:

||user|group|world|
|-:|:-:|:-:|:-:|
|unwanted|`---`|`-w-`|`-w-`|
|binary|`000`|`010`|`010`|
|octal|`0`|`2`|`2`|

And now my `.gitolite.rc`:

```perl
%RC = (
	UMASK => 0022,
	WRITER_CAN_UPDATE_DESC => 1,
	ROLES => {
		READERS => 1,
		WRITERS => 1,
	},
	
	ENABLE => [
		# commands
		'help',
		'desc',
		'info',
		'perms',
		'writable',
		'create',
		'readme',
		'D',

		'ssh-authkeys', # authorization mechanism
		'git-config', # read by cgit
		'cgit', # updates 'description' file instead of 'gitweb.description' config
	],
);

1;
```

# HTTP Access with cgit

Cgit is probably the easiest thing to set up. It has great built-in
documentation (`man 5 cgitrc`). Pretty much all configuration is in
`/etc/cgitrc` (css/syntax highlighting isn't in there). The only reason I'm
posting my config here is because for some reason, the order of the options in
cgit's config matters:

```conf
# cgit config; see cgitrc(5) for details

cache-size=0

enable-commit-graph=1
enable-git-config=0
enable-index-owner=0

clone-url=https://git.pipeframe.xyz/$CGIT_REPO_URL git@pipeframe.xyz:$CGIT_REPO_URL

max-repo-count=9999
max-repodesc-length=9999

css=/style.css
logo=
footer=

virtual-root=/
remove-suffix=1

root-title=git.pipeframe.xyz
root-desc=
root-readme=/usr/local/lib/cgit/root-readme.md

mimetype.gif=image/gif
mimetype.html=text/html
mimetype.jpg=image/jpeg
mimetype.jpeg=image/jpeg
mimetype.pdf=application/pdf
mimetype.png=image/png
mimetype.svg=image/svg+xml

source-filter=/usr/lib/cgit/filters/syntax-highlighting.py
about-filter=/usr/local/lib/cgit/filters/about-filter
head-include=/usr/local/lib/cgit/head-include.html
robots=

readme=:README.md
readme=:readme.md
readme=:README.mkd
readme=:readme.mkd
readme=:README.rst
readme=:readme.rst
readme=:README.html
readme=:readme.html
readme=:README.htm
readme=:readme.htm
readme=:README.txt
readme=:readme.txt
readme=:README
readme=:readme

section-from-path=1
scan-path=/srv/git
```

Some notable tweaks I made were:

- The `about-filter` uses `pandoc` to convert most document types to HTML (and
  properly renders GitHub-flavored markdown unlike the built-in
  about-formatting\.sh script)
- I tweaked the [style.css](https://git.pipeframe.xyz/style.css)
- I added a custom [script.js](https://git.pipeframe.xyz/script.js) that
  currently does the following:
  - Modifies the repository clone URLs to copy the URL on click instead of
    navigating
  - Make the root title a link to '/' for quickly clearing URL query parameters
  - Open binary blobs in the tree explorer as raw instead of hexdump by default

