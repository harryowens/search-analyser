function enableAnalysis() {
    document.getElementById("analyse-button").disabled = false;
}

function createListItem(itemText) {

    let element = document.createElement('li');
    element.className = 'list-item'
    element.innerHTML = `
            <span>${itemText}</span>
            <i class="fas fa-plus-circle add-to-research"></i>
    `
    return element;

}

async function analyseSearches() {
    // avoid repeat search for the same seed by disabling analyse button 
    document.getElementById("analyse-button").disabled = true;

    const seed = document.getElementById("seed-input").value;
    const topSearches = await fetch(`../top/${seed}`)
        .then(response => response.json()); // chain instead of await to avoid multiple variables
    const questions = await fetch(`../questions/${seed}`)
        .then(response => response.json());
    const competitors = await fetch(`../competitors/${seed}`)
        .then(response => response.json());
    const concerns = await fetch(`../concerns/${seed}`)
        .then(response => response.json());
    // populate each list individually, asynchronously
    // TODO: handle errors, e.g. empty lists
    // TODO: parse ASCII tokens (e.g. &#39, for apostrophe)
    populateResultsList('top-searches', topSearches);
    populateResultsList('questions', questions);
    populateResultsList('competitors', competitors);
    populateResultsList('concerns', concerns);
}

function populateResultsList(listName, results) {
    const resultsList = document.getElementById(listName + '-list');

    // clear any existing results
    resultsList.innerHTML = '';

    results.forEach((result) => {
        resultsList.appendChild(createListItem(result));
    });
}

// time delay function that can be awaited in a loop
// source: https://stackoverflow.com/a/44476626/726221
const timeDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

// function is async so we can await the time delay (specified in ms)
async function typewriterText(target, textStrings, charDelay) {

    // span that the text will be inserted into / removed from
    const targetNode = document.getElementById(target);

    // Run on a continuous loop
    while (true) {

        for (let i = 0; i <= (textStrings.length - 1); i++) {

            // remove any existing characters one-by-one, with a delay between each
            const existingText = targetNode.textContent;
            for (let x = 0; x <= existingText.length; x++) {
                targetNode.textContent = existingText.substring(0, existingText.length - x);
                await timeDelay(charDelay);
            }

            // add the characters in the string one-by-one
            for (let y = 0; y <= textStrings[i].length; y++) {
                targetNode.textContent = textStrings[i].substring(0, y);
                await timeDelay(charDelay);
            }

            // pause while the full brand is displayed
            await timeDelay(3000);
        }

        // pause longer on the last item ("your brand")
        await timeDelay(3000);
    }
}

function alternateBrandSuggestions() {

    const brands = [
        'Starbucks',
        'Peloton',
        'Playstation',
        'Greggs',
        'Amazon',
        'Coca Cola',
        'your brand'
    ]
    typewriterText('title-search-seed', brands, 50);
}