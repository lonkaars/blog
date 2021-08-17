[meta]: <title> (My home automation adventure)
[meta]: <subtitle> (How to make your house a shitty utopia)
[meta]: <author> (Loek)
[meta]: <date> (August 17 2021)
[meta]: <tags> (home automation, raspberry pi, software, hardware, hacking)
[meta]: <cover> (/img/homeauto.png)

Home automation is cool, but it can also be scary. I want to try to convert my
existing bedroom lights into 'smart' lights that I can control using a home
automation system.

I've tried two home automation systems so far: homebridge and home assistant.
Homebridge isn't really an automation system. It's meant to add unsupported
devices to *homekit*, but doesn't work with anything other than apple devices.
I've also tried (and am currently using) home assistant.  It's a complete
replacement for the homekit ecosystem, and it can do basically anything, as
long as you're patient enough...

The devices I'm going to try to automate are:

- A random bluetooth RGB/white lamp I bought a couple years back
- An RGB strip under my bed my mom got me for christmas
- A gen 1 Philips LivingColors lamp from 2008
- My Toshiba RAS-M10GKV-E2 air conditioning unit

## The bluetooth RGB lamp

This lamp is apparently another Chinese product that gets rebranded and sold
under different names. I bought mine as the "[Shada led's
light](http://leds-lightpro.com/node/4368)" (no the apostrophe isn't a typo).

When scanning for bluetooth devices using `bluetoothctl` on Linux, it shows up
as an LE device called "Beken LED".

I don't remember what search term I used when searching for it's bluetooth
protocol, but I landed on [this page](https://wiki.fhem.de/wiki/BEKEN_iLedBlub)
from a german website about home automation, where it's called the "BEKEN
iLedBulb". It documents which Bluetooth LE characteristics you need to write to
for the lamp to change color.

The lamp has both [iOS](https://apps.apple.com/us/app/leds-light/id1058642950)
and
[android](https://play.google.com/store/apps/details?id=com.shada.ledslight&hl=en_US&gl=US)
apps available, though only the iOS app seemed to work.

### Writing a homebridge plugin

When I started out with this home automation business, I used homebridge
because I didn't know about home assistant yet. Developing plugins for
homebridge is actually pretty easy (after figuring out [how to get the plugin
to load](https://github.com/homebridge/homebridge/issues/2958)). The
documentation is pretty good, and it has typescript integration for maximum
/comfy/-ness.

Because HomeKit doesn't support RGBW or RGBWW lights (lights that have both rgb
and dedicated white diodes), I chose to display them as seperate rgb and white
lamps inside the home app.

[The plugin](https://www.npmjs.com/package/homebridge-beken) is pretty janky,
and requires some manual setup, but it worked very consistently for the single
week I used it for.

### Converting the homebridge plugin to home assistant

Now that I could control a single bulb using the home app and siri, I needed
more. The homebridge website allows for turning devices on/off, but doesn't
allow color changes. I also liked the idea of controlling the lights using my
phone, which runs android.

Home assistant was the solution, so I went ahead and installed [home assistant
core](https://www.home-assistant.io/installation/linux#install-home-assistant-core)
on the Raspberry Pi 3B+ I'm using as a dedicated home automation hub.

Upon opening it for the first time, I noticed it was much slower than
homebridge, but that's because it was installing a bunch of other stuff in the
background. After waiting for the background tasks to complete, I was greeted
with a very nice web interface. There were also already devices that I could
integrate immediately, like the downstairs chromecasts, and my Jellyfin server.

Now I had to figure out how to write a plugin for home assistant. There's some
concepts in the home assistant ecosystem that I didn't quite understand, which
made searching where to start harder. 

**Integrations** are like plugins, they allow you to *integrate* an unsupported
device into home assistant. Integrations create **devices** which create
**entities** (device properties). Certain entity types can only be read (like
`sensor`), and others can also be updated / written to (lights).

The documentation for creating entity integrations is pretty poopy, and I
mostly used other plugins on GitHub as reference material. The home assistant
plugin code is available on
[GitHub](https://github.com/lonkaars/homeassistant-beken) and [my personal git
server](https://git.pipeframe.xyz/lonkaars/homeassistant-beken/about).

## The RGB gamer bed

I was originally planning to control this strip using IR remote emulation, but
I remembered a friend of mine still had an esp8266 laying around. So I went the
extra mile and wanted to try to create a new driver board for the strip
instead.

### Opening the original driver

![](/img/homeauto/controller_original.jpg)

![](/img/homeauto/opening_controller.jpg)

![](/img/homeauto/open_controller.jpg)

![](/img/homeauto/controller_board.jpg)

### Making a custom driver board

**I AM NOT AN ELECTRICIAN**. I looked on the internet, and I think this is just
a simple board with some mosfets and flash memory for storing the 6 custom
colors. The mosfets are the 3 big squares labeled Q1, Q2 and Q3. The way the
strip works is it gets +12v though the black wire, and then lights up when you
ground any combination of the red, green, and blue wires. The strip dims using
pulse width modulation. The mosfets act like an electronic switch, and control
the grounding of the colored wires.

I'm going to salvage the mosfets, and barrel plug from the original driver
board, and resolder them on a perfboard with the esp8266 so I can control them
over WiFi. The schematic I'm using comes from
[instructables](https://www.instructables.com/WiFi-Controlled-RGB-LED-Strip-With-ESP8266/).

![](/img/homeauto/schematic.png)

--- photo of thing in breadboard ---

--- photo of thing in perfboard ---

### Beautiful dremel work

I wanted to use the original enclosure instead of a tupperware container this
time, so I used my dad's dremel to create holes for the esp to fit.

![](/img/homeauto/shittydremel.png)

![](/img/homeauto/espfit.png)

As you can see I did a great job :^)

--- photo of perfboard in case ---

### ESP firmware

The firmare I wrote for the esp is available on
[GitHub](https://github.com/lonkaars/esp8266-rgbstrip) and [my git
server](https://git.pipeframe.xyz/lonkaars/esp8266-rgbstrip/about), along with
the home assistant plugin
([GitHub](https://github.com/lonkaars/hass-esp8266-rgbstrip),
[cgit](https://git.pipeframe.xyz/lonkaars/hass-esp8266-rgbstrip/about)). I used
the [espressif ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK)
toolchain with gnu make as my build system.

It just connects to your specified wifi network under your specified hostname,
and listens on port 80 for regular http requests. Here's how to use it without
the home assistant plugin:

```bash
# get color
curl http://hostname/

# set color      rrggbb color (hex)
curl -X POST -d "0000ff" http://hostname/
```

Some cool features this firmare has are:

- Linearly interpolated color transitions with customizable transition and step
	duration
- Brightness curve correction (makes difference in brightness more pronounced
	at higher brightness levels by using a parabolic curve)

I'm not sure if the more popular [ESPHome](https://esphome.io/) firmare has
these features, but I wanted to have a go at writing my own firmare anyways.

### Safety

Because the esp8266 is a pretty basic microcontroller, it doesn't use https or
ssl for encryption. To protect from people in my house wanting to control my
lights, I used the raspberry pi's on board wifi module to create a hidden
private isolated wifi network for this, and all future IoT devices in my
bedroom. I'm using `hostapd` to create the wifi network, and `dnsmasq` for
assigning ip addresses and hostname resolution.  Here's the config file for
`dnsmasq`:

```
no-resolv
interface=wlan0
dhcp-range=10.0.0.1,10.0.0.16,24h
server=8.8.8.8
```

And here's `hostapd`'s config file:

```bash
# common settings
interface=wlan0
driver=nl80211
ssid=network_name_here
hw_mode=g
channel=1
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=1
wpa=2
wpa_passphrase=network_password_here
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP

# raspberry pi 3b+ specific settings
ieee80211n=1          # 802.11n support
wmm_enabled=1         # QoS support
ht_capab=[HT40+][SHORT-GI-20][DSSS_CCK-40]
```

Very complicated stuff...

## The Philips LivingColors lamp

[This](http://www.knutsel.org/2009/01/01/livingcolors-1st-generation/) article
describes all the research that went into reverse-engineering the lamp.

## The Toshiba air conditioning unit

IR remote emulation with LIRC

