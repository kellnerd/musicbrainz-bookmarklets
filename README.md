# musicbrainz-bookmarklets

**[Bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet) and other JavaScript snippets for MusicBrainz.org**

In order to use one of the snippets under [`src/`](src/) as a bookmarklet you can save the compressed code snippets from the sections below as bookmarks or convert them yourself.

Running `node bookmarkletify.js snippet.js` outputs a minified version of `snippet.js` in the form of a `javascript:` URI that can be copied.

Before you run the above script you have to make sure that you have setup *Node.js* and have installed the dependencies of the script via `npm install`.

## [Guess Unicode punctuation](src/guessUnicodePunctuation.js)

```js
javascript:void function(e,c){$(e).each((e,g)=>{let a=g.value;$(g).css('background-color',''),c.forEach(([e,g])=>{a=a.replace(e,g)}),a!=g.value&&$(g).val(a).trigger('change').css('background-color','yellow')})}(['input#name','input.track-name','#id-edit-recording\\.name','#id-edit-work\\.name'].join(),[[/(?<!\S)"(.+?)"(?!\S)/g,'\u201c$1\u201d'],[/(?<!\S)'(.+?)'(?!\S)/g,'\u2018$1\u2019'],[/(\d+)"/g,'$1\u2033'],[/(\d+)'(\d+)/g,'$1\u2032$2'],[/'/g,'\u2019'],[/(?<!\.)\.{3}(?!\.)/g,'\u2026'],[/ - /g,' \u2013 '],[/(\d+)-(\d+)/g,'$1\u2013$2'],[/-/g,'\u2010']]);
```

- Searches and replaces ASCII punctuation symbols for all title input fields by their preferred Unicode counterparts.
- Works for release title and track titles (in the release editor), recording and work title (on their respective edit pages).
