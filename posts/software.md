[meta]: <title> (Software that I use)
[meta]: <subtitle> (Desktop software, server software, phone apps, everything)
[meta]: <author> (Loek)
[meta]: <date> (April 13 2021)
[meta]: <tags> (software, open source, server, phone)
[meta]: <cover> (/img/software.png)

## PC software

All of the software on this page is cool and I think you should try it. I also
use all of this software, and will update this page when I find new, *even
cooler* software to use instead. Most if not all of my configuration files
(dotfiles) are on my [github](https://github.com/lonkaars/dotfiles). You can
clone these and edit them to fit your needs, or you can use them as a reference
for when you can't figure out how to configure something.

### Regular software

- **Email client**: [neomutt](https://neomutt.org/). It's fast and simple,
  though configuring it was a pain in the ass. I'm currently using it in
  combination with mbsync and imapnotify to get notifications for new emails,
  and sync my mailbox for fast email viewing.

- **Music player**: [mpd](https://www.musicpd.org/) with
  [ncmpcpp](https://github.com/ncmpcpp/ncmpcpp). This is the best music setup
  I've ever used. I download all my music in .flac format and mpd *just works*.
  Since mpd has a server-client structure, I could also use this to set up
  multiple devices that can add music to a central queue at a party or
  something, but I just use it to launch [an fzf mpc
  wrapper](https://github.com/DanielFGray/fzf-scripts/blob/master/fzmp) to
  quickly add music while I'm doing something else.

- **Text editor**: [nvim](https://neovim.io/). It's vim. If you don't like vim,
  you should try using it longer. If you still don't like vim, you can use
  [code oss](https://appimage.github.io/Code_OSS/) which is visual studio code
  but without Microsoft's creepy telemetry features.

- **PDF viewer**: [zathura](https://pwmt.org/projects/zathura/). It's a pdf
  viewer with vim bindings, and it works with my TeX editing setup's live
  reload thingy.

- **Image viewer**: [sxiv](https://github.com/muennich/sxiv). It's like zathura
  but for images, but it also does a bunch of other stuff that I don't use very
  often.

- **Browser**: [brave](https://brave.com/). It's a normie-friendly chromium
  fork with extra privacy features! I of course use brave (or any
  chromium-based browser) with [tampermonkey](https://www.tampermonkey.net/),
  [ublock origin](https://ublockorigin.com/),
  [stylus](https://github.com/openstyles/stylus) and [dark
  reader](https://darkreader.org/).

- **Terminal**: [st](https://st.suckless.org/). It's fast and simple, nothing
  to complain about. I have my [own st fork](https://github.com/lonkaars/st),
  with a bunch of patches that make me happy.

- **Password manager**: [bitwarden](https://bitwarden.com/). Open source
  password manager that you can host yourself. It also has public servers which
  are mostly free, but some features like time-based one-time passwords are
  paid. All the clients are also open source.

- **Document typesetting**: [LaTeX](https://www.latex-project.org/) (using
  [latexmk](https://personal.psu.edu/~jcc8/software/latexmk/) with the
  [XeTeX](http://xetex.sourceforge.net/) compiler).

- **File browser**: [ranger](https://github.com/ranger/ranger). It's kind of
  slow, but I use the bulkrename feature very often, and I haven't gotten used
  to the perl `rename` script yet.

- [unar](https://github.com/MacPaw/XADMaster). I like running `unar [archive]`
  instead of using `7z`, `tar`, `unzip`, etc. It creates a new folder to unpack
  to automatically so it does exactly what I need.

### OS stuff

- **Window manager**: [i3-gaps](https://github.com/Airblader/i3). I tried it
  once and didn't switch back so this is a winner I guess. I've also heard good
  things about [dwm](https://dwm.suckless.org/), though I haven't used it
  myself. Most people complain about i3's limited configurability, but I
  haven't ran into something that it doesn't do for me.

- **Application launcher**: [rofi](https://github.com/davatorium/rofi). I've
  been using rofi since I started using linux, and haven't switched to anything
  else because it's *very* configurable, and has a dmenu mode for using it
  instead of dmenu with other scripts. I use it primarily as my application
  launcher, but I also have a hotkey setup to launch `bwmenu` which is a script
  that fills in bitwarden passwords using rofi.

- **Shell**: [zsh](https://www.zsh.org/) with [oh-my-zsh](https://ohmyz.sh/).
  It's zsh, all the cool kids use it already. I do have `/usr/bin/sh` `ln -s`'d
  to `/usr/bin/bash`, but I'd like to change that to `/usr/bin/dash`. Eh, I'll
  get around to it someday.

- **Status Bar**: [polybar](https://github.com/polybar/polybar). Simple bar,
  gets the job done, the configuration files make me go insane though. It took
  me a good half year of ricing to understand the polybar configuration files,
  and I'm still not sure if I do.

- **Notification daemon**: [dunst](https://dunst-project.org/). I used to use
  deadd-notification-center, but that has waaaay too many haskell dependencies
  on arch, so I don't use that anymore.

- **Global keybinds**:
  [xbindkeys](https://www.nongnu.org/xbindkeys/xbindkeys.html). Simple
  configuration, works flawlessly, 10/10.

- **Compositor**: [picom](https://github.com/yshui/picom). It's a simple
  compositor. I use it to enable vsync for desktop windows, and I have it set
  up to only show a drop shadow on floating i3 windows.

### Closed source

- [discord](https://discord.com/). Gamer. The only reason this is listed here
  is because I use discord with
  [betterdiscord](https://github.com/rauenzi/BetterDiscordApp) (which *is*
  open-source). Betterdiscord allows you to use custom css themes, custom
  plugins and a whole bunch of other cool stuff that regular discord doesn't
  do. It's technically against TOS, but I don't really care as I only use
  quality of life improvement plugins.

- [figma](https://figma.com). It's the designing software that I use to create
  user interface or website mockups. It's easily accessible though a browser,
  and it uses webassembly so it's also decently fast. It's free for personal
  use.

## Server software

This is the software that runs on my home server.

### Email

I used [Luke Smith's](http://lukesmith.xyz/)
[emailwiz](https://github.com/LukeSmithxyz/emailwiz) to set up my email server.
The script installs and configures an email setup with
[postfix](http://www.postfix.org/), [dovecot](https://www.dovecot.org/),
[spamassassin](https://spamassassin.apache.org/) and
[opendkim](http://www.opendkim.org/).

### Etesync

I run my own [etesync](https://www.etesync.com/) server for synchronizing my
to-do lists, calendar and contacts. It's relatively easy to set up, and has a
web interface that you can use with your own self-hosted instance.

### Bitwarden

I also run my own [bitwarden](https://github.com/bitwarden/server) server. It
uses docker with docker-compose, which are two things that I'm supposed to know
about, but I don't.

I'm working on a connect 4 website myself, and I'm planning on learning to use
docker with docker-compose to make it easier to run the seperate parts that are
needed to host the project.

### Git

I have a [cgit](https://git.zx2c4.com/cgit/about/) server to host my git
repositories on <https://git.pipeframe.xyz>, and I use
[gitolite](https://gitolite.com/gitolite/) for ssh git push access. Cgit is
very easy to set up, and I like it very much. Gitolite on the other hand is a
pain in the ass to set up, because the documentation is not that great. If
you're planning on using gitolite on your own server, set the umask in
`~/.gitolite.rc` of your server's git account to `0022`.

### SFTP

I have two semi-public sftp accounts set up on my server: `media` and `sftp`.
`sftp` is for generic file sharing, and `media` is for my media. Both accounts
have tty login disabled and are chroot-jailed to /var/media and /var/sftp.

## Phone apps

These are the apps that I use on my phone. I recently upgraded my 2017 Nokia 6
to a Google Pixel 4a (sunfish). It's a great phone! You can root it or flash
custom rom's very easily, and it gave me new appreciation for the basic
features of a smartphone. The Pixel 4a has really good haptics. They're almost
iPhone level, though I won't be using iPhones any time soon.

I flashed [CalyxOS](https://calyxos.org/) as soon as it was 5 minutes out of
the box, but ended up not liking it because of it's nonexistant root support.
I'm currently using [LineageOS](https://lineageos.org/) 18.1, rooted using
[magisk](https://github.com/topjohnwu/Magisk).

### Open source

- **One-time password generator**: [andotp](https://github.com/andOTP/andOTP)

- **App store**: [aurora store](https://gitlab.com/AuroraOSS/AuroraStore). This
  app works better when you're rooted, but it's way better than the google play
  store.

- **App store**: [aurora f-droid](https://gitlab.com/AuroraOSS/auroradroid)

- **Password manager**: [bitwarden](https://github.com/bitwarden/mobile)

- **Browser**: [bromite](https://www.bromite.org/). This is basically ungoogled
  chromium but for mobile.

- **Calendar**: [etar](https://github.com/Etar-Group/Etar-Calendar)

- [etesync](https://github.com/etesync/android)

- **File browser**: [material
  files](https://github.com/zhanghai/MaterialFiles). It looks sexy, it's free,
  it's awesome.

- **Email client**: [k-9](https://k9mail.app/).

- **Maps**: [osmand](https://osmand.net/).

- **Music player**: [shuttle](https://www.shuttlemusicplayer.com/). It looks
  sexy, it's free, it's awesome.

- **Instant messenger**: [signal](https://signal.org/). [papa musk said
  it](https://twitter.com/elonmusk/status/1347165127036977153).

- **Manga reader**: [tachiyomi](https://tachiyomi.org/)

- **To-do lists**: [tasks.org](https://tasks.org/). This is easily the best
  to-do app I've ever used, and it integrated very well with etesync.

- **Smart home control**: [home assistant](https://www.home-assistant.io/).
	[the whole spiel](/post/homeauto).

- **Notes**: [leaflet](https://github.com/PotatoProject/Leaflet). It's
	basically Google Keep but open source and without Google. It's part of the
	PotatoProject which is a custom Android rom, and there were plans for an open
	source notes sync server that you could host yourself, but I haven't seen
	that pop up yet.

	The app is written in Flutter, and did have choppy scrolling animations on my
	old phone. I'm not sure if that was a bug or my old phone just being
	underpowered, but it's something I want to mention anyways.

- **Weather**: [geometric
	weather](https://f-droid.org/en/packages/wangdaye.com.geometricweather/).
	It's really good. Good animations, live wallpaper, fast, etc.

- **RSS Reader**: [tiny tiny
	rss](https://www.f-droid.org/en/packages/org.fox.tttrss/). This app requires
	that you host your own tiny tiny rss server, but I do and the app works
	great!

- **Myanimelist client**: [moelist](https://github.com/axiel7/MoeList). I don't
	know how I found this app but it's a real gem. If you use MAL you should
	download this app.

### Requires root

- **Ad-blocker**: [adaway](https://adaway.org/). It does have a rootless mode,
	though the app warns you that it's slower and impacts your battery life
	negatively.

- **Theme engine**: [substratum](https://github.com/substratum/substratum).
	Substratum requires root on android 9+, unless you're on stock samsung (one
	ui). Android 8 and under users can buy
	[andromeda](https://play.google.com/store/apps/details?id=projekt.andromeda).
	Samsung users can buy
	[synergy](https://play.google.com/store/apps/details?id=projekt.samsung.theme.compiler).
	They're both developed by the same people behind substratum, but they're not
	open source.

### Closed source

- **Reddit client**:
  [sync](https://play.google.com/store/apps/details?id=com.laurencedawson.reddit_sync)

