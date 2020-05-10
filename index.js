const ERRTEST = 'Invalid for testid, please use this format screenName.shortDescription.elementType';
const ERRTESTFILE = 'Invalid for testid, please use filename for first word for test id';
const ERRTESTCML = 'Invalid for testid, please use camel case and max 20 charcters for shortDescription ';
const ERRTESTEXACTENUM = 'Invalid for testid, please use button, link, paragraph, input, subHeader or header for element  type ';
const ERRINTL = 'Invalid for id, please use this format screenName.shortDescription.elementType.textType';
const ERRINTFILE = 'Invalid for intlid, please use filename for first word for test id';
const ERRINTCML = 'Invalid for intlid, please use camel case and max 20 charcters for shortDescription ';
const ERRINTEXACTENUMELM = 'Invalid for intlid, please use button, link, paragraph, input, subHeader or header for element type ';
const ERRINTEXACTENUMTXT = 'Invalid for intlid, please use text, placeHolder, message, errorMessage, loadingText or hoverText  for text type ';


const camelize = (str) => {
  let arr = str.split('-');
  let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);
  let capitalString = capital.join("");
  return capitalString;
}

const fileNameCheck = (exactFileName, firstSplitValue) => {
  const patt = /^\w+-\w[\w-]*$/;
  let camelCasedValue = exactFileName;
  if(patt.test(exactFileName)) {
    camelCasedValue = camelize(exactFileName);
  }
  return firstSplitValue !== camelCasedValue;
}

const getFileName = (path) => {
  const filenameWithExt = path && path.split("/").pop();
  const abosoluteFileName = filenameWithExt && filenameWithExt.split('.')[0];
  return abosoluteFileName;
}


const checkValideTestId = function (str, path, context, node)  {
  const exactFileName = getFileName(path);
  const validInputType = ['button', 'link', 'paragraph', 'input', 'subHeader', 'header'];
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
  const validInputType = ['button', 'link', 'paragraph', 'input', 'subHeader', 'label', 'text', 'header'];
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
  if (exactFileName && numberOfSplitValue && numberOfSplitValue.length === 4 && fileNameCheck(exactFileName,numberOfSplitValue[0])) {
    context.report({
      node: node,
      message: ERRINTFILE
   });
  }
}

const checkIntlIdHandler = (intlProps , type, fileName, context, node) => {
  intlProps.forEach((prop) => {
    const isIntlId =  type === 'component' ? prop.type === 'JSXAttribute' &&
          prop.name.name === 'id' :  prop.key.type === 'Identifier' &&
          prop.key.name === 'id';
    if(isIntlId) {
      checkValideIntlId(prop.value.value, fileName, context, node)
    }
  });
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
                checkValideTestId(attr.value.value, fileName, context, node)
              }
            });
          },
        }
      }
    },
    "intl-id-match" : {
      create: function (context) {
        const fileName = context.getFilename();
        return {
          JSXOpeningElement: function(node) {
            const nodeType = node.name.name;
            if (nodeType === 'FormattedMessage') {
              const intlProps = node.attributes;
              checkIntlIdHandler(intlProps, 'component', fileName, context, node)
            }
          },
          CallExpression: function(node) {
           
            const objectName = node.callee.object && node.callee.object.name;
              if (objectName === 'intl' ) {
                const intlProps = node.arguments[0].properties;
    
                checkIntlIdHandler(intlProps, 'key', fileName, context, node)
                
              }
    
            },
        }
      }
    }
    }
  };

  
  