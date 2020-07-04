

module.exports = {
  rules: {
    "validate-test-intl-id": {
      create: function (context) {
        return {
          JSXAttribute(node) {
            const propName = node.name && node.name.name;
            const value = node.value;
            const validInputType = ['button', 'link', 'paragraph', 'input', 'subHeader'];
            if(propName === 'testID' || propName === 'tabBarTestID') {
              const numberOfSplitValue = value.split(".");
              if (value === null || numberOfSplitValue.length !== 3) {
                context.report({
                  node,
                  message: 'Invalid for testId , please use this format screenName.shortDescription.elementType',
                  data: '',
                  fix(fixer) {
                    return fixer.insertTextAfter(node, "='screenName.shortDescription.elementType'");
                  }
                });
              }
              if (validInputType.includes(numberOfSplitValue[numberOfSplitValue.length - 1], 3)) {
                const data = getErrorData(exceptions);
                context.report({
                  node,
                  message: 'Please use any of type from button, link, paragraph, input, subHeader for elementType',
                  data: ''
                });
              }
            }
          }
        }
      }
    }
  }
};
