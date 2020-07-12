# eslint-config-starscraper

The standard guide to convention for Starscraper projects

## Getting Started

Install the package

`$ npm install eslint-plugin-starscraper`

## Rules

### "test-id-match"
  > Enforce the consistancy of Test Id naming convention

  - Example: `screenName.shortDescription.elementType`

    - Screen Name (home, login, sign-out) - must match filename (you can use "context.getFilename()")

    - Short Description (welcome, explanation, info) - allow only alphabetic characters, enforce camel casing and 20 character max string length

    - Element Type (button, link, paragraph, input, subHeader) - use an enum to validate the type allowed

### "intl-id-match"
  > Enforce the consistancy of Intl Id naming convention

  - Example: 'screenName.shortDescription.elementType.textType'

    - Screen Name (home, login, sign-out) - must match filename (you can use "context.getFilename()")

    - Short Description (welcome, explanation, info) - allow only alphabetic characters, enforce camel casing and 20 character max string length

    - Element Type (button, link, paragraph, input, subHeader) - use an enum to validate the type allowed

    - Text Type (text, placeHolder, message, errorMessage, loadingText, hoverText) - use an enum to validate the type allowed

### 'unique-test-ids'

  > Enforce Test Id is unique across files

### 'unique-intl-ids'

  > Enforce Intl Id is unique across files

### 'required-fields-for-intl'

  > Enforce Intl with Id , defaultMessage  and description property

### 'spacing-system'

  > Absolute pixel values can never be provided to font-sizes, margins, or padding

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
    "starscraper/unique-test-ids": "error",
    "starscraper/unique-intl-ids": "error",
    "starscraper/required-feilds-for-intl": "error",
    "starscraper/spacing-system": "error",
  },
  --------------
}
```
