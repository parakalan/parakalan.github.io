---
title: Carnatic
permalink: /carnatic
---

_This is the first write-up in a series of articles on some problems I plan to solve with code. I am starting off with something very close to me, Carnatic Music. I've tried to dabble in <a href="https://github.com/parakalan/ragarecognition" target="_blank">raga recognition</a> before. The one we are going to see is a bit more ambitious, maybe more useful to people. I don't know suddha rishabham from chatusruthi rishabham, but I can try, can't I ?!_


### The Problem

<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr">There must be an effort to digitize all known Carnatic songs with notations / variations etc. Something like a full fledged search engine for that. For example, I should be able to search for a sequence of swaras and be able to get matching krithis or parts of them.</p>&mdash; Sudharsan (@parakalakavi) <a href="https://twitter.com/parakalakavi/status/1530581285067862017?ref_src=twsrc%5Etfw">May 28, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### The Motive

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><p lang="en" dir="ltr">I was hooked with &quot;saamagaana vinodini gunadaama shyaamakrishNanutE&quot;, I would love to know where else would I get a similar experience &#39;anubhavam&#39;.</p>&mdash; Sudharsan (@parakalakavi) <a href="https://twitter.com/parakalakavi/status/1530581287156654080?ref_src=twsrc%5Etfw">May 28, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### How do I want to solve this ?

1. Our data source has to be <a href="http://www.shivkumar.org/music/index.html" target="_blank">shivkumar.org</a>. It is a treasure trove for people interested in this music. We'll scrape all the notations(the swaras) for all available songs and index it.