function copyfn(copy) {
    /* Get the text field */
    
  
    /* Select the text field */
  
  
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copy);
    
    /* Alert the copied text */
    alert("Copied the text: " + copy);
  }