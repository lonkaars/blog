---
title: software that I use
tags: [software, open source, server, phone]
---

This page contains a list of open source software that I have used and have strong opinions
about. I'll try to keep this page up-to-date when I find new, *even cooler* software to use
instead.

# Linux (Desktop)

{:.admonition.info}
> {:.title}
> Note
>
> Most of the software listed here is configured using configuration files (dotfiles). Mine can
> be found [here][dotfiles].

## Regular software

- **Email client**: [NeoMutt] or [Thunderbird]

  I generally use NeoMutt to check my inbox and read short messages. It's fast and simple,
  though configuring it was a pain in the ass. I'm currently using it in combination with
  [mbsync] and [imapnotify] to get notifications for new emails and sync my mailbox for fast
  (offline) email viewing.

  NeoMutt's default keybinds are weird, and it's unresponsive while an error message is
  visible? Whenever I need to search through archived messages or actually send mail I tend to
  use Thunderbird instead.

- **Music player**: [mpd] with [ncmpcpp]

  Hands-down the best music player I've ever used. I collect music in `.flac` format and mpd
  *just works*. The only thing that sucks about mpd is the lack of graphical client
  applications that don't look bad. The only graphical client I know of that doesn't suck is
  [Persephone], which sadly only runs on MacOS.

- **Text editor**: [Neovim]

  It's vim. If you don't like vim, you should try using it longer. If you still don't like vim,
  I would recommend [Code OSS], which is Visual Studio Code but without Microsoft's creepy
  telemetry features.

- **PDF viewer**: [zathura]

  It's a pdf viewer with vim bindings, and it reloads files automatically when they're updated,
  which is nice when writing LaTeX documents.

- **Image viewer**: [sxiv]

  It's like zathura but for images. It also does a bunch of other stuff that I don't use very
  often.

- **Browser**: [Brave]

  Yet another chromium fork, but with extra privacy features. I have a half-baked [Firefox]
  rice, but still don't use it as my main browser due to the horrible trackpad support on X11.

- **Terminal**: [st]

  The only fast and simple terminal emulator that does what I want and doesn't get in my way. I
  forked [the upstream st source][st-upstream] and merged in a bunch of patches that make me
  happy.

- **Password manager**: [pass]

  TODO

- **Document typesetting**: [LaTeX] with [latexmk] and the [XeTeX] compiler

  TODO

## Utilities

- [fzmp]

  This is a client for [mpd], which allows you to search your library using [fzf]. I sometimes
  randomly think of a very specific song in my library, and fzmp allows me to find and queue
  any song extremely efficiently.

- [lf] (terminal file manager)
- [unar]

  I like running `unar [archive]` instead of using `7z`, `tar`, `unzip`, etc. It creates a new
  folder to unpack to automatically so it does exactly what I need.

- [BetterDiscord]

  BetterDiscord allows you to use custom css themes, custom plugins and a whole bunch of other
  cool stuff that regular Discord doesn't do. It's technically against TOS, but I don't really
  care as I only use quality of life improvement plugins.

### Browser extensions

- [Violentmonkey]
- [uBlock Origin]
- [Stylus]
- [Dark Reader]
- [Yomitan]

## OS stuff

- **Window manager**: [i3]

  I tried it once and didn't switch back so this is a winner I guess. I've also heard good
  things about [dwm], though I haven't used it myself. Most people complain about i3's limited
  configurability, but I haven't ran into something that it doesn't do for me.

- **Application launcher**: [rofi]

  I've been using rofi since I started using linux, and haven't switched to anything else
  because it's *very* configurable, and has a dmenu mode for using it instead of dmenu with
  other scripts. I use it primarily as my application launcher, but I also have a hotkey setup
  to launch `bwmenu` which is a script that fills in bitwarden passwords using rofi.

- **Shell**: [zsh] with [oh-my-zsh]

  It's zsh, all the cool kids use it already. I do have `/usr/bin/sh` `ln -s`'d to
  `/usr/bin/bash`, but I'd like to change that to `/usr/bin/dash`. Eh, I'll get around to it
  someday.

- **Status Bar**: [polybar]

  Simple bar, gets the job done, the configuration files make me go insane though. It took me a
  good half year of ricing to understand the polybar configuration files, and I'm still not
  sure if I do.

- **Notification daemon**: [dunst]

  I used to use `deadd-notification-center`, but that has waaaay too many haskell dependencies
  on arch, so I don't use that anymore.

- **Global keybinds**: [xbindkeys]

  Simple configuration, works flawlessly, 10/10.

- **Compositor**: [picom]

  It's a simple compositor. I use it to enable vsync for desktop windows, and I have it set up
  to only show a drop shadow on floating i3 windows.

- [Figma] (**CLOSED SOURCE**)

  It's the designing software that I use to create user interface or website mockups. It's
  easily accessible though a browser, and it uses webassembly so it's also decently fast. It's
  free for personal use.

# Linux (Server)

- **Email server**: [dovecot] and [postfix] with [opendkim] and [spamassassin]

  I used [Luke Smith's emailwiz][emailwiz] to set up my email server and tweaked some settings
  afterwards.
- **Contacts/calendar sync**: [Radicale]

  I used to self-host [EteSync] for synchronizing my to-do lists, calendar and contacts, but
  moved to Radicale because CalDAV is generally supported better. EteSync has some neat
  built-in journalling features, but is primarily built for privacy. I would still recommend it
  if you don't have the option to self-host and want your data to remain private, but Radicale
  is significantly easier to set up and works out-of-the box with all the CalDAV/CardDav
  clients I tried, while EteSync mostly relies on an EteSync↔DAV adapter for compatibility.

- **File sync**: [Syncthing]
- **Static HTTP host**: [nginx]
- **WebDAV**: [nginx]
- **Git**: [gitolite] and [cgit] ([see full post](/post/git))
- **Media server**: [Jellyfin]
- **BitTorrent Client**: [Transmission]

# Android

These are the apps that I use on my phone. I've been daily driving a Google Pixel 4a (sunfish)
running [LineageOS]. It's honestly a great phone, and the only complaints I have about it are
software-related (and therefore self-inflicted). Pixel devices can easily be rooted or flashed
with custom roms.

When I first got this phone I immediately tried flashing [CalyxOS], but I ended up switching to
LineageOS because CalyxOS doesn't have great root support.

- **One-time password generator**: [andotp]

- **App store**: [aurora]. This app works
  better when you're rooted, but it's way better than the google play store.

- **App store**: [aurora-fdroid]

- **Password manager**: [Bitwarden]

- **Browser**: [bromite]. This is basically ungoogled chromium but
  for mobile.

- **Calendar**: [etar]

- [etesync]

- **File browser**: [materialfiles]. It looks sexy,
  it's free, it's awesome.

- **Email client**: [K-9 mail][k9mail].

- **Maps**: [osmand].

- **Music player**: [shuttle]. It looks sexy, it's free,
  it's awesome.

- **Instant messenger**: [signal].

- **Manga reader**: [tachiyomi]

- **To-do lists**: [tasks.org]. This is easily the best to-do app I've ever used, and it
  integrated very well with etesync.

  If you're cheap (like me), you can get 'free' pro by downloading this app through f-droid
  instead of the play store. It's still nice to donate.

- **Smart home control**: [home assistant][hass].

- **Weather**: [geometric weather]. It's really good. Good animations, live
  wallpaper, fast, etc.

- **Myanimelist client**: [MoeList]. I don't know how I found this app but it's a real gem. If
  you use MAL you should download this app.

- **PDF reader**: [pdf viewer plus]. This is the only one that's actually
  decent. Good UI, good UX, pretty fast rendering. 9/10

## Requires root

- [adaway]

  Blocks ads system-wide! It does have a rootless mode, though the app warns you that it's
  slower and impacts your battery life negatively.

# Sucks

This is software that I used before but have moved away from or recommend you stay away from
too.

- [Sync for Reddit] (Android) (**CLOSED SOURCE**)

  Used to work fine on rooted devices with MicroG, but completely broke after the Material You
  support update. I was able to restore an older version of the app without reinstalling, but
  completely stopped using Reddit after [the whole 2023 API pricing
  thing](https://en.wikipedia.org/wiki/2023_Reddit_API_controversy) anyways so never bothered
  to find a good replacement app.
- [Bitwarden]
- [ranger]

{% include links.md %}
