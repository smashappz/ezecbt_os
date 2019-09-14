
# How to contribute a new language

## Create a JSON file

Copy the `src/Locales/en.json` file to a new locale following [the ISO-639-1](http://www.loc.gov/standards/iso639-2/php/English_list.php) code. 

For example, if want to translate into French, do:

```
cp src/Locales/en.json src/Locales/fr.json
```

## Fill out the JSON file

Go through as much as you can and translate into your language. If you can't translate everything, that's okay, it will fall back to English.

## Open up `src/i18n.js` and add your language

In the file, add an import line:

```
import fr from "./Locales/fr.json";
```

And then add it to the translations object:

```
i18n.translations = { fr, en };
```

## Save your code and open up a new PR

```
git checkout -b french
git add .
git commit -m "Add French"
git push
```

Then go on github, click "New Pull Request", and then fill in your branch and master:

## Then, give a little description of what you're doing and open your PR!

## Finally, give a translation of the description

If you can, in your PR, please include a translation of the description of the app for Google Play.
