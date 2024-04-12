---
title: Avans wifi setup
subtitle: How to use Avans eduroam with NetworkManager
author: Loek
date: September 9 2021
tags:
    - software
cover: /img/avanswifi.png
---

I wasted 2 hours trying to set up my school's WiFi, so here's a quick reference
for other students who might've tried connecting but ended up giving up.

```
$ nmcli connection edit type wifi
nmcli> set 802-11-wireless.ssid eduroam
nmcli> set 802-1x.eap peap
nmcli> set 802-1x.phase2-auth mschapv2
nmcli> set 802-1x.identity <avans username>
nmcli> set 802-1x.password <avans password>
nmcli> set wifi-sec.key-mgmt wpa-eap
nmcli> save
nmcli> activate
```

Keep in mind that your username isn't your student e-mail, but the first letter
of your first name, and 7 characters from your last name, e.g.  `Loek Le
Blansch -> lblansch`.

