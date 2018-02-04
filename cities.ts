import * as fs from "fs";

const puppeteer = require('puppeteer');

async function getCities(page) {
	let cities = {};
	if (fs.existsSync('cities.json')) {
		const json = fs.readFileSync('cities.json');
		cities = JSON.parse(json.toString());
	} else {
		cities = await page.$$eval('div.left-innen div ul li a', (set) => {
			const cities = {};
			set.forEach(a => {
				console.log(a);
				const name = a.innerText;
				cities[name] = a.href;
			});
			return cities;
		});
		fs.writeFileSync('cities.json',
			JSON.stringify(cities));
	}
	return cities;
}

async function getDoctors(page, cityLink) {
	console.log('cityLink', cityLink);
	await page.goto(cityLink);
	return await page.$$eval('div.ergebnis', (set) => {
		// console.log('set', set.length);
		return set.map(div => {
			const img = div.querySelector('div.portrait-small img');
			const face = img ? img.getAttribute('src') : null;
			const a = div.querySelector('div.ergebnis-info h2 a');
			const addr = div.querySelector('div.ergebnis-info h2 + div');
			const address = addr ? addr.innerText.trim() : null;
			let job = div.querySelector('div.ergebnis-info p.grau');
			job = job ? job.innerText.trim() : null;
			//console.log(a.innerText);
			return {
				name: a.innerText,
				details: a.getAttribute('href'),
				address,
				face,
				job
			};
		});
	});
}

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.jameda.de/arztsuche/fachgebiete/staedte/aerzte/augenaerzte/');

	page.on('console', msg => {
		for (let i = 0; i < msg.args.length; ++i)
			console.log(`${i}: ${msg.args[i]}`);
	});

	const cities = await getCities(page);
	console.log('cities', cities);

	for (let city in cities) {
		console.log('== ', city);
		let cityLink = cities[city];
		let doctors = await getDoctors(page, cityLink);
		console.log(doctors);
	}

	await browser.close();
})();

