console.log("script is running");
const cssProperties = {};
const userCssProperties = {};

// add suffix like px, !important
function formatPropertyValue(property, value, important=true) {
  const propertyUnits = {
    width: "px",
    height: "px",
  };

  const unit = propertyUnits[property] || "";
  const formattedValue = `${value}${unit}`;

  return important ? `${formattedValue} !important` : formattedValue;
}

// converts CSS object to string that will be written in theme file
function objectToCssString(cssObject) {
  let cssString = "";
  console.log("cssObject", cssObject);

  for (const selector in cssObject) {
    const properties = cssObject[selector];
    cssString += `.${selector} {\n`;

    for (const property in properties) {
      const value = properties[property];
      const formattedValue = formatPropertyValue(property, value);
      cssString += `  ${property}: ${formattedValue};\n`;
    }

    cssString += "}\n\n";
  }

  return cssString;
}

const inputs = document.querySelectorAll(".inputThemeBuilder");

inputs.forEach((input) => {
  input.addEventListener("change", function () {
    console.log("dataaaa", this);
    const component = this.closest(".component");
    const componentName = component.dataset.component;
    const propertyName = this.dataset.cssproperty;
    const propertyValue = this.value;

    // create css property within the object if it doesn't already exist
    if (!cssProperties[componentName]) {
      cssProperties[componentName] = {};
    }

    cssProperties[componentName][propertyName] = propertyValue;

    const cssString = objectToCssString(cssProperties);

    webviewApi.postMessage({
      name: "setTheme",
      themeCSS: cssString,
    });
  });
});
