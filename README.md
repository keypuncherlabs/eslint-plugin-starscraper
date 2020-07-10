# eslint-config-starscraper

The standard guide to convention for Starscraper projects

## Getting Started

Install the package

`$ npm install eslint-plugin-starscraper`

## Rules

### "test-id-match"

    Example: 'screenName.shortDescription.elementType'

    Screen Name (home, login, sign-out) - must match filename (you can use "context.getFilename()")

    Short Description (welcome, explanation, info) - allow only alphabetic characters, enforce camel casing and 20 character max string length

    Element Type (button, link, paragraph, input, subHeader) - use an enum to validate the type allowed

### "intl-id-match"

    Example: 'screenName.shortDescription.elementType.textType'

    Screen Name (home, login, sign-out) - must match filename (you can use "context.getFilename()")

    Short Description (welcome, explanation, info) - allow only alphabetic characters, enforce camel casing and 20 character max string length

    Element Type (button, link, paragraph, input, subHeader) - use an enum to validate the type allowed

    Text Type (text, placeHolder, message, errorMessage, loadingText, hoverText) - use an enum to validate the type allowed

### 'validate-unique-test-id'

    Ensure Test Id is always unique across files

### 'validate-unique-intl-id'

  Ensure Intl Id is always unique across files

## Using the rule(s)

Add the plugin to the list of plugins in the .eslintrc file

```
{
  -----------
  "plugins": [
    "starscraper"
  ],
  --------------
}
```

Add to rule(s)

```
{
  -----------
  "rules": {
    "starscraper/test-id-match": "error",
    "starscraper/intl-id-match": "error",
     "starscraper/validate-unique-test-intl-id": "error",
  },
  --------------
}
```
