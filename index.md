---
title: Loek's excruciatingly interesting blog
layout: default
id: index
toc: false
---

Welcome to my blog page! This is where I post updates on things that I do such
as:

- Cool open source software that I think you should use
- How to set up self-hosted applications
- Rants about Microsoft Windows
- Maybe some recipes I dunno

The page you're looking at right now is also open-source! The code for this
page can be found on [GitHub](https://github.com/lonkaars/blog), and should
also be available on [my private git server](https://git.pipeframe.xyz).

An rss/atom feed of this blog is also available:
```
https://{{ site.domain }}/atom.xml
```

---

## Recent posts

<div class="recentPosts">
{% for post in site.posts limit:4 %}
    <div class="postCard">
        <a href="{{ post.url }}">
            <img src="{{ post.cover }}" alt="post cover" class="cover">
            <h2 class="title">{{ post.title }}</h2>
            <strong class="subtitle">{{ post.subtitle }}</strong>
        </a>
        {% include tags.html tags=post.tags %}
    </div>
{% endfor %}
</div>

[Go to all posts](/search){:.button}

