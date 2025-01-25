---
title: Avans eduroam wifi setup
tags:
    - software
---

I wasted 2 hours trying to set up my school's WiFi on my laptop, so here's a
quick reference for other students who might've tried connecting but ended up
giving up.

Keep in mind that your username isn't your student e-mail, but the first letter
of your first name, and 7 characters from your last name (not including a
middle name if you have one), i.e.  `Loek Le Blansch -> lblansch`.

# Linux with NetworkManager

Steps for `nmcli`:

```
$ nmcli connection edit type wifi
nmcli> set 802-11-wireless.ssid eduroam
nmcli> set 802-1x.eap peap
nmcli> set 802-1x.phase2-auth mschapv2
nmcli> set 802-1x.identity <username>
nmcli> set 802-1x.password <password>
nmcli> set wifi-sec.key-mgmt wpa-eap
nmcli> save
nmcli> activate
```

# Android

You can connect to eduroam without installing any additional apps by manually
adding a network in the Android WiFi settings using the following connection
settings:

|field|value|
|-|-|
|**Network name/SSID**|`eduroam`|
|**Security**|WPA3-Enterprise|
|**EAP method**|PEAP|
|**Phase 2 authentication**|MSCHAPV2|
|**CA certificate**|Use system certificates|
|**Minimum TLS version**|TLS v1.0|
|**Online Certificate Status**|Do not verify|
|**Domain**|`wifi.avans.nl`|
|**Identity**|\<username\>|
|**Anonymous identity**|anonymous|
|**Password**|\<password\>|



