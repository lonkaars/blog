[meta]: <title> (Avans wifi setup)
[meta]: <subtitle> (How to use Avans eduroam on Arch Linux)
[meta]: <author> (Loek)
[meta]: <date> (September 6 2021)
[meta]: <tags> (software)
[meta]: <cover> (/img/avanswifi.png)

I wasted 2 hours trying to set up my school's WiFi, so here's a quick reference
for other students who might've tried connecting but ended up giving up.

> NOTE: I'm using **NetworkManager** on my own installation, so that's what I'm
> writing this guide for.

1. Install `iwd`
   ```
   # pacman -S iwd
   ```
	 `iwd` is needed because NetworkManager can't connect to WPA enterprise
	 networks as stated by the [arch
	 wiki](https://wiki.archlinux.org/title/NetworkManager#WPA_Enterprise_connection_with_NetworkManager)
2. Set `iwd` as NetworkManager's backend by adding the following to your
	 `/etc/NetworkManager/NetworkManager.conf`:
   ```dosini
   [device]
   wifi.backend=iwd
   ```
3. Enable/start `iwd.service`
   ```
   # systemctl enable --now iwd
   ```
4. Create a new file `/var/lib/iwd/eduroam.8021x` with the following contents,
	 replacing the \<placeholders\> with your own credentials:
   ```dosini
   [Security]
   EAP-Method=PEAP
   EAP-Identity=anonymous
   EAP-PEAP-Phase2-Method=MSCHAPV2
   EAP-PEAP-Phase2-Identity=<username>
   EAP-PEAP-Phase2-Password=<password>
   
   [Settings]
   AutoConnect=True
   ```
	 Keep in mind that your username isn't your student e-mail, but the first
	 letter of your first name, and 7 characters from your last name, e.g.
   `Loek Le Blansch -> lblansch`.

After setting all of this up, your laptop should atomatically connect to the
eduroam network. If you want to connect manually, you'll need to use the
command-line utility `iwctl`, or use the following command:

```
$ iwctl station wlan0 connect eduroam
```

(wlan0 can differ depending on your network card).

You can (and should) still use `nmcli` to connect to normal networks, but I
haven't tested if it works for eduroam too.

