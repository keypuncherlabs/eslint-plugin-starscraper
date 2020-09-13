
const ids = [];
const ERRTEST = 'Invalid for testid, please use this format screenName.shortDescription.elementType';
const ERRTESTFILE = 'Invalid for testid, please use filename for first word for test id';
const ERRTESTCML = 'Invalid for testid, please use camel case and max 20 charcters for shortDescription ';
const ERRTESTEXACTENUM = 'Invalid for testid, please use button, link, paragraph, input, subHeader, header, tab, or banner for element  type ';
const ERRINTL = 'Invalid for id, please use this format screenName.shortDescription.elementType.textType';
const ERRINTFILE = 'Invalid for intlid, please use filename for first word for test id';
const ERRINTCML = 'Invalid for intlid, please use camel case and max 20 charcters for shortDescription ';
const ERRINTEXACTENUMELM = 'Invalid for testid, please use button, link, paragraph, input, subHeader, header, tab, or banner for element type ';
const ERRINTEXACTENUMTXT = 'Invalid for testid, please use text, placeHolder, message, errorMessage, loadingText or hoverText  for text type ';


const camelize = (str) => {
  let arr = str.split('-');
  let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
  let capitalString = capital.join("");
  return capitalString;
}

const countHelper = (input, arr ) => {
  const count = arr.filter(x => x === input).length;
  return count;
}

const fileNameCheck = (exactFileName, firstSplitValue) => {
  const patt = /^\w+-\w[\w-]*$/;
  let camelCasedValue = exactFileName;

  if(patt.test(exactFileName)) {
    camelCasedValue = camelize(exactFileName);
  }

  return firstSplitValue !== camelCasedValue;
}

const fileNameCheckForIntl= (exactFileName, firstSplitValue) => {
  const patt = /^\w+-\w[\w-]*$/;
  let camelCasedValue = exactFileName;

  if(patt.test(exactFileName)) {
    camelCasedValue = camelize(exactFileName);
  }

  return firstSplitValue !== camelCasedValue || firstSplitValue === 'global';
}

const getFileName = (path) => {
  const filenameWithExt = path && path.split("/").pop();
  const abosoluteFileName = filenameWithExt && filenameWithExt.split('.')[0];
  return abosoluteFileName;
}

const validInputType = ['button', 'link', 'paragraph', 'input', 'subHeader', 'header', 'tab', 'banner'];

const checkValideTestId = function (str, path, context, node)  {
  const exactFileName = getFileName(path);
  const numberOfSplitValue = str && str.split(".");
  const patt = /^([a-z][A-Za-z]).{1,18}$/;
  if(str === null || (numberOfSplitValue && numberOfSplitValue.length !== 3)) {
    context.report({
          node: node,
          message: ERRTEST,
    });
  } 

  if (numberOfSplitValue && !validInputType.includes(numberOfSplitValue[numberOfSplitValue.length - 1])) {
    context.report({
      node: node,
      message: ERRTESTEXACTENUM,
     });
  }

  if (numberOfSplitValue && numberOfSplitValue.length === 3 && !patt.test(numberOfSplitValue[1])) {
    context.report({
      node: node,
      message: ERRTESTCML
   });
  }

  if (exactFileName && numberOfSplitValue && numberOfSplitValue.length === 3 && fileNameCheck(exactFileName,numberOfSplitValue[0])) {
    context.report({
      node: node,
      message: ERRTESTFILE
   });
  }

}

const checkValideIntlId = function (str, path, context, node)  {
  const exactFileName = getFileName(path);
  const vaildTestType = ['text', 'placeHolder', 'message', 'errorMessage', 'loadingText', 'hoverText']
  const numberOfSplitValue = str && str.split(".");
  const patt = /^([a-z][A-Za-z]).{1,18}$/;
  if(str === null || (numberOfSplitValue && numberOfSplitValue.length !== 4)) {
    context.report({
      node: node,
      message: ERRINTL,
    });
  } 

  if ( numberOfSplitValue && !validInputType.includes(numberOfSplitValue[2])){
    context.report({
      node: node,
      message: ERRINTEXACTENUMELM,
    });
  }

  if (numberOfSplitValue &&  !vaildTestType.includes(numberOfSplitValue[numberOfSplitValue.length - 1])) {
    context.report({
      node: node,
      message: ERRINTEXACTENUMTXT,
    });
  }

  if (numberOfSplitValue && numberOfSplitValue.length === 4 && !patt.test(numberOfSplitValue[1])) {
    context.report({
      node: node,
      message: ERRINTCML
   });
  }
  if (exactFileName && numberOfSplitValue && numberOfSplitValue.length === 4 && fileNameCheckForIntl(exactFileName,numberOfSplitValue[0])) {
    context.report({
      node: node,
      message: ERRINTFILE
   });
  }
}

module.exports = {
    rules: {
      "test-id-match": {
        create: function (context) {
          return {
            JSXOpeningElement: function (node) {
            const fileName= context.getFilename();
            node.attributes.forEach((attr) => {
              const isTestId = attr.type === 'JSXAttribute' &&
                    attr.name.name === 'testID';
              if (isTestId && attr.value.type) {
                ids.push(attr.value.value);
                checkValideTestId(attr.value.value, fileName, context, node)
              }
            });
          },
        }
      }
    },
    "intl-id-match" : {
      create: function (context) {
        return {
          CallExpression: function(node) {
            const fileName = context.getFilename();
            const objectName = node.callee.object && node.callee.object.name;
              if (objectName === 'intl') {
                const intlProps = node.arguments[0].properties;
    
                intlProps.forEach((prop) => {
                  const isIntlId = prop.key.type === 'Identifier' &&
                        prop.key.name === 'id';
                  if(isIntlId) {
                    ids.push(prop.value.value);
                    checkValideIntlId(prop.value.value, fileName, context, node)
                  }
                });
                
              }
    
            },
        }
      }
    },
    "unique-test-ids": {
      create: function (context) {
        return {

          JSXOpeningElement: function (node) {
            node.attributes.forEach((attr) => {
              const isTestId = attr.type === 'JSXAttribute' &&
                    attr.name.name === 'testID';
              if (isTestId && attr.value.type) {
                const testValue = attr.value.value;
                const countCurId = countHelper(testValue, ids)
                if (testValue && countCurId >= 2 ) {
                  context.report({
                    node,
                    message: 'This id is taken , please use an unique one.',
                    data: ''
                  });
                }
              }
            });
          },

          
        }
      }
    },
    "unique-intl-ids": {
      create: function (context) {
        return {
          CallExpression: function(node) {
            const objectName = node.callee.object && node.callee.object.name;
              if (objectName === 'intl') {
                const intlProps = node.arguments[0].properties;
                intlProps.forEach((prop) => {
                  const isIntlId = prop.key.type === 'Identifier' &&
                        prop.key.name === 'id';
                  if(isIntlId) {
                    const intlIDValue = prop.value.value;
                    const countCurId = countHelper(intlIDValue, ids)
                if (intlIDValue && countCurId >= 2) {
                  context.report({
                    node,
                    message: 'This id is taken , please use an unique one.',
                    data: ''
                  });
                }
                  }
                });
                
              }
        
            },
        }
      }
    },
    "required-fields-for-intl": { 
      create: function (context) {
        return {
          CallExpression: function(node) {
            const objectName = node.callee.object && node.callee.object.name;
              if (objectName === 'intl') {
                const intlProps = node.arguments[0].properties;
                intlProps.forEach((prop) => {
                  if( intlProps.length < 3 || (prop.key.name !== "id" && prop.key.name !== "defaultMessage" && prop.key.name !== "description") )
                  context.report({
                      node,
                      message: 'The id, defaultMessage and description are required for intl ',
                      data: ''
                    });
                });
                
              }
    
            },
      }
    }

    },
    'spacing-system' : {
      create: function (context) {
        return {

          JSXOpeningElement: function (node) {
            node.attributes.forEach((attr) => {
              const attrName = attr.name.name;
              const isSpaceId = attr.type === 'JSXAttribute' &&
                    (attrName === 'mt' || attrName === 'mb' || attrName === 'mr' || attrName === 'ml' ||
                    attrName === 'pt' || attrName === 'pb' || attrName === 'pr' || attrName === 'pl') ;
              if (isSpaceId && attr.value.type) {
                const spaceValue = attr.value.value;
                if ( spaceValue  ) {
                  context.report({
                    node,
                    message: 'Please use spacing[] value instead of absolute pixel',
                    data: ''
                  });
                }
              }
            });
          },

          
        }
      }
    }
    }
  };

  
  