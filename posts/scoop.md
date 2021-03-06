[meta]: <title> (Scoop guide)
[meta]: <subtitle> (Handbook and quick explanations)
[meta]: <author> (Loek)
[meta]: <date> (July 22 2021)
[meta]: <tags> (windows, normie, software)
[meta]: <cover> (/img/scoop.png)

Here's a quick reference for returning customers:

```bash
# installing stuff
scoop install <program name>

# removing stuff
scoop uninstall <program name>

# updating all the stuff
scoop update *

# update single stuff
scoop update <program name>

# add a bucket / repository
scoop bucket add <bucket name>

# searching for stuff
scoop search <search term>
# keep in mind that scoop's search is very slow
```

For more things look in the [wiki](https://github.com/lukesampson/scoop/wiki)
or in the wiki's [faq](https://github.com/lukesampson/scoop/wiki/FAQ).

Now here's a list of things that people who don't use `cmd` get confused about:

- Highlighting text in cmd selects it. If you've selected text, right click
	copies it. If you don't have text selected, right click pastes it.
- Ctrl-c and ctrl-v won't work as you expect them to. The same goes for most
	keyboard shortcuts commonly used in graphical ('normal') programs. Ctrl-c is
	used to stop programs in cmd, and ctrl-v doesn't do anything. The keyboard
	shortcut for pasting in cmd is shift+insert.
- Clicking inside the cmd window to place your text cursor doesn't work,
	because clicking is only used for selection. You'll have to use your arrow
	keys to move the cursor. You can also use ctrl-a to move it to the beginning
	of a line, or ctrl-e to move it to the end of a line.
- It's normal for programs in cmd to not give any output and just silently
	quit. This is normal and if a program doesn't output anything you can assume
	it did the thing you wanted it to do. (though scoop is very verbose and will
	print progress info most of the time)
- You can type new commands for the computer to execute once you see the prompt
	again. Most of the time it looks something like this:
  
  ```
  C:\Windows\System32> 
	```

## Installation (on a fresh system)

```powershell
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iwr -useb get.scoop.sh | iex
```

## Some more things explained

### Why scoop at all

Scoop is a package manager. These are the primary way you install software on
Linux. The reason package managers are awesome, is because it's like an app
store in the sense that it's one central place to install all your software,
but without the downsides of an actual app store.

If you develop your own software, you can write a scoop install script for it,
and create a pull request on GitHub. This way basically anyone can add software
into scoop, but it's still moderated better than for example wikipedia.

Scoop also has more open source software, which is better (most of the time).
This means you're more likely to get 'better software' like 7-zip instead of
(bad) (paid) software like winrar or winzip.

Scoop also uses powershell scripts to install software which means you won't
have to click through installers, or watch out for sneaky buttons that also
install some weird toolbar in your browser.

### Buckets

Buckets are a collection of similar programs. The way these are managed is
through something called a repository. This is just a central place for
multiple people to view and collaborate on scoop at once.

Buckets you'll probably want to add are `extras`, `nonportable`, `games`, and
`java`.

By adding a bucket you're not actually installing any software, but scoop will
check for updates on that bucket.

If you want to for example install java using scoop, you'll first have to add
the `java` bucket by running `scoop bucket add java` in order for scoop to be
able to find the `openjdk` package. Then you can run `scoop install openjdk`,
and then you'll have java installed.

### Brave (browser)

Because the default brave browser in scoop isn't updated, I use the [everonline
repo](https://github.com/everonline/brave). Here's how to do that:

```bash
scoop bucket add everonline https://github.com/everonline/brave.git
scoop install everonline/brave
```

## Awesome software

[Here's](/post/software#pc-software) a list of the software I use pretty much every day,
and some of it is also available for windows using scoop!
