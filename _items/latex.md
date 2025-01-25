---
title: My LaTeX setup
tags: software latex git
---

I started using LaTeX instead of MS Word about two years ago, and I've never
regretted the decision. I switched out of frustration because Word makes it
really easy to mess up your document structure without you noticing.

## Cool features LaTeX gets you

- Automatically numbered figures with references that automatically update
- Really simple bibliography management with `biblatex`
- Packages that help you typeset scientific things like chemistry or physics
- Professional looking output documents with very little effort
- Automation of repetitive things with macros
- It's a plain text format, so it works well with `git` or other version
	control software
- Probably more

## Installation

This guide is for Arch Linux and it's derivatives, but you can use
[pkgs.org](https://pkgs.org) to find the mentioned packages if they're under a
different name in your distro's package manager.

### Required packages

- `biber`
- `texlive-most`, containing:
	- `texlive-bibtexextra`
	- `texlive-core `
	- `texlive-fontsextra `
	- `texlive-formatsextra`
	- `texlive-games`
	- `texlive-humanities`
	- `texlive-latexextra`
	- `texlive-music`
	- `texlive-pictures`
	- `texlive-pstricks`
	- `texlive-publishers`
	- `texlive-science`

tl;dr

```
# pacman -S texlive-most biber
```

### Force XeTeX compiler with latexmk

To force latexmk to use the `xelatex` compiler instead of `pdflatex` you can
create `~/.config/latexmk/latexmkrc` with the following content:

```
$pdflatex = "xelatex %O %S";
$pdf_mode = 1;
$dvi_mode = 0;
$postscript_mode = 0;
```


## Hello world

> I have recently made another repository on my profile for template files, you
> can find it [here on github](https://github.com/lonkaars/templates) or [here
> on git.pipeframe.xyz](https://git.pipeframe.xyz/lonkaars/templates). It
> includes a latex starting point with more commonly used packages, and other
> files I tend to copy from other projects

LaTeX uses a lot of auxiliary files for compilation, so it's a good idea to
create a new directory for every document. After creating a new directory,
create a .tex file and open it with a text editor.

```tex
\documentclass[12pt, a4paper, dutch]{article}
\usepackage[margin=1in]{geometry}
\usepackage{babel}

\bigskipamount=7mm
\medskipamount=4mm
\parindent=0mm

\begin{document}
Hello world!
\end{document}
```

This is the starting point I generally use for all my documents. It uses a4
paper and 2.54cm margins, which is the default in Word (in Europe). Because
most of my documents are in Dutch, I add the `dutch` option to my document
class, and import the babel package for correct word breaking and built-in
latex heading translations. I also disable paragraph indenting, and modify the
`\bigskip` and `\medskip` distances.

After creating the .tex file, you can run `latexmk <your .tex file>` to compile
the document. When it's done, you should have a new .pdf file in your directory
with the same name as the .tex file.

Keep in mind that you can probably install an extension for your text editor to
have it automatically compile and refresh your document for you. If you're
using Visual Studio Code, you can use the [LaTeX
Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
extension, and for vim I use [vimtex](https://github.com/lervag/vimtex) with
[coc-vimtex](https://github.com/neoclide/coc-vimtex) for
[coc](https://github.com/neoclide/coc.nvim).

## Notes

### LaTeX and git

Because LaTeX creates a lot of temporary files, you should add the following to
your repository's `.gitignore`:

```gitignore
*.aux
*.bbl
*.bcf
*.blg
*.fdb_latexmk
*.fls
*.log
*.out
*.run.xml
*.synctex.gz
```

