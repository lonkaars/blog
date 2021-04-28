[meta]: <title> (My git setup)
[meta]: <subtitle> (How I use git on my server)
[meta]: <author> (Loek)
[meta]: <date> (April 28 2021)
[meta]: <tags> (git, server, software)
[meta]: <cover> (/img/git.png)

## Overview

I have two mechanisms set up for accessing my git server. I use gitolite for
ssh access and permission management. I also have cgit set up which generates
html pages for viewing your repositories and also hosts your repositories over
http, or https if you have it set up.

## SSH Access with gitolite

Gitolite was a pain in the ass to set up because I didn't understand umasks
before I started trying to set it up. A *umask* is like the opposite of what
you'd enter when running `chmod`. For example: if I run `touch test`, I will
now have a file with the same permissions as `chmod 644`. That looks something
like this:

```sh
$ touch test
$ ls -l
total bla bla
-rw-r--r--  1 loek users 0 Apr 28 12:28 test
$ chmod 644 test
$ ls -l
total bla bla
-rw-r--r--  1 loek users 0 Apr 28 12:28 test
$ # notice the same permissions on the 'test' file
```

If I want gitolite to create repositories with default permissions so other
users can read the repositories, I have to set my umask to the opposite of 644.
Here's a quick explanation of `ls -l`'s output:

```sh
-rw-r--r-- * user group size date time filename
|└┬┘└┬┘└┬┘
| |  |  └all users
| |  └owner group
| └owner user
└type
```

Each digit in a `chmod` command sets the permission for the file owner, file
group, then everyone. That looks something like this:

```sh
$ chmod 644 test

decimal:  6   4   4
binary:   110 100 100
ls -l:  - rw- r-- r--
```

Then we take the opposite of this to get the umask:

```sh
$ chmod 755 directory -R

ls -l:  d rwx r-x r-x
binary:   000 010 010
decimal:  0   2   2
```

And now my `.gitolite.rc`:

```perl
%RC = (
    UMASK       => 0022,
    ROLES => {
        READERS => 1,
        WRITERS => 1,
    },
    
    ENABLE => [
        'ssh-authkeys',
        'git-config',
        'daemon',
        'gitweb',
    ],
);

1;
```

## HTTP(S) Access with cgit

Cgit is probably the easiest thing to set up. It has great built-in
documentation (`man 5 cgitrc`). Pretty much all configuration is in
`/etc/cgitrc` (css/syntax highlighting isn't in there). The only reason I'm
posting my config here is because for some reason, the order of the options in
cgit's config matters:

```rc
#
# cgit config
# see cgitrc(5) for details

cache-size=0
enable-commit-graph=1

css=/cgit.css
logo=/cgit.png

virtual-root=/
remove-suffix=1

root-title=git :tada:

##
## List of common mimetypes
##
mimetype.gif=image/gif
mimetype.html=text/html
mimetype.jpg=image/jpeg
mimetype.jpeg=image/jpeg
mimetype.pdf=application/pdf
mimetype.png=image/png
mimetype.svg=image/svg+xml

# Highlight source code with python pygments-based highlighter
source-filter=/usr/lib/cgit/filters/syntax-highlighting.py

# Format markdown, restructuredtext, manpages, text files, and html files
# through the right converters
about-filter=/usr/lib/cgit/filters/about-formatting.sh

##
## Search for these files in the root of the default branch of repositories
## for coming up with the about page:
##
readme=:README.md
readme=:readme.md
readme=:README.rst
readme=:readme.rst
readme=:README.txt
readme=:readme.txt
readme=:README
readme=:readme
readme=:INSTALL.md
readme=:install.md
readme=:INSTALL.mkd
readme=:install.mkd
readme=:INSTALL.rst
readme=:install.rst
readme=:INSTALL.html
readme=:install.html
readme=:INSTALL.htm
readme=:install.htm
readme=:INSTALL.txt
readme=:install.txt
readme=:INSTALL
readme=:install

scan-path=/mnt/scf/git/repositories
```

