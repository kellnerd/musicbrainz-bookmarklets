// ==UserScript==
// @name         MusicBrainz: Guess Unicode punctuation
// @version      2021.3.2
// @namespace    https://github.com/kellnerd/musicbrainz-bookmarklets
// @author       kellnerd
// @description  Searches and replaces ASCII punctuation symbols for all title input fields by their preferred Unicode counterparts.
// @homepageURL  https://github.com/kellnerd/musicbrainz-bookmarklets#guess-unicode-punctuation
// @downloadURL  https://raw.githubusercontent.com/kellnerd/musicbrainz-bookmarklets/main/dist/guessUnicodePunctuation.user.js
// @updateURL    https://raw.githubusercontent.com/kellnerd/musicbrainz-bookmarklets/main/dist/guessUnicodePunctuation.user.js
// @supportURL   https://github.com/kellnerd/musicbrainz-bookmarklets/issues
// @grant        none
// @match        *://*.musicbrainz.org/release/*/edit
// ==/UserScript==

(function () {
	'use strict';

	/**
	 * Transforms the values of the selected input fields using the given substitution rules.
	 * Highlights all updated input fields in order to allow the user to review the changes.
	 * @param {string} inputSelector CSS selector of the input fields.
	 * @param {(string|RegExp)[][]} substitutionRules Pairs of values for search & replace.
	 */
	function transformInputValues(inputSelector, substitutionRules) {
		$(inputSelector).css('background-color', ''); // disable possible previously highlighted changes
		$(inputSelector).each((_index, input) => {
			let value = input.value;
			if (!value)
				return; // skip empty inputs
			substitutionRules.forEach(([searchValue, newValue]) => {
				value = value.replace(searchValue, newValue);
				console.debug(value);
			});
			if (value != input.value) { // update and highlight changed values
				$(input).val(value)
					.trigger('change')
					.css('background-color', 'yellow');
			}
		});
	}

	const transformationRules = [
		[/(?<=\W|^)"(.+?)"(?=\W|$)/g, '“$1”'], // double quoted text
		[/(?<=\W|^)'(.+?)'(?=\W|$)/g, '‘$1’'], // single quoted text
		// ... which is enclosed by non-word characters or at the beginning/end of the title
		[/(\d+)"/g, '$1″'], // double primes, e.g. for 12″
		[/(\d+)'(\d+)/g, '$1′$2'], // single primes, e.g. for 3′42″ but not for 70’s
		[/'/g, '’'], // ... and finally the apostrophes should be remaining
		[/(?<!\.)\.{3}(?!\.)/g, '…'], // horizontal ellipsis (but not more than three dots)
		[/ - /g, ' – '], // en dash as separator
		[/(\d{4})-(\d{2})-(\d{2})(?=\W|$)/g, '$1‐$2‐$3'], // hyphens for ISO 8601 dates, e.g. 1987‐07–30
		[/(\d{4})-(\d{2})(?=\W|$)/g, '$1‐$2'], // hyphen for ISO 8601 partial dates, e.g. 2016-04
		[/(\d+)-(\d+)/g, '$1–$2'], // en dash for ranges where it means "to", e.g. 1965–1972
		[/-/g, '‐'], // ... and finally the hyphens should be remaining
		// difficult to find rules for: em dash (rare), minus (very rare), figure dash (very rare)
		// TODO: localize quotes using release/lyrics language
	];

	/**
	 * Searches and replaces ASCII punctuation symbols for all given input fields by their preferred Unicode counterparts.
	 * These can only be guessed based on context as the ASCII symbols are ambiguous.
	 * @param {string[]} inputSelectors CSS selectors of the input fields.
	 */
	function guessUnicodePunctuation(inputSelectors) {
		transformInputValues(inputSelectors.join(), transformationRules);
	}

	const releaseEditorTitleInputs = [
		'input#name', // release title
		'input.track-name', // all track titles
		'input[id^=disc-title]', // all medium titles
	];

	// insert a "Guess punctuation" button next to the "Guess case" button
	const button = $('<button type="button">Guess punctuation</button>');
	$(button).on('click', () => {
		guessUnicodePunctuation(releaseEditorTitleInputs);
	});
	$('.guesscase .buttons').append(button);

}());