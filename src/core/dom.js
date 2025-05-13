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
            document.createTextNode(child)
        }else if (child instanceof Node){
            // Append as element node if it's a valid DOM node
            element.appendChild(child)
        }
    })
}