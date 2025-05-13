export function createElement(tag,props = {}, ...children){
    const element =document.createElement(tag);

    // Set attributes if any
    Object.keys(props).forEach(key=>{
        element.setAttribute(key,props[key])
    })
    
    // Append children: Handle both string (text) and element nodes
    children.forEach(child=>{
        if(typeof child === 'string'){
            // Append as text node if it's a string
            element.appendChild(document.createTextNode(child));
        }else if (child instanceof Node){
            // Append as element node if it's a valid DOM node
            element.appendChild(child)
        }
    });

    return element
}

export function setAttribute(element, key, value) {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else if (key === "className") {
      element.setAttribute("class", value);
    } else if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
    } else if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  }
  