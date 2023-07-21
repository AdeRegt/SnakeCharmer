// Snakecharmer 
// Created by Alexandros de Regt since 2023-07-21

class SnakeCharmerPythonClass{

    /**
     * Constructor for the Snake Charmer Python Class
     * @param {String} classname 
     * @param {String} outputtarget 
     * @param {String} code 
     */
    constructor(classname,outputtarget,code){
        this.name = classname;
        this.target = outputtarget;
        this.rawcode = code;

        if(typeof this.name !=="string"){
            throw new Error("Classname should be a string");
        }

        if(typeof this.target !=="string"){
            throw new Error("Target should be a string");
        }

        if(typeof this.rawcode !=="string"){
            throw new Error("Rawcode should be a string");
        }
    }
}

/**
 * Takes a scriptelement in consideration
 * @param {HTMLScriptElement} scriptelement 
 * @returns nothing
 */
function snakecharmer_inspect_script_element(scriptelement){

    //
    // maybe this is not a right script element.
    console.log("snakecharmer: now inspecting script element",scriptelement);
    if(typeof(scriptelement)==="undefined"){
        console.warn("snakecharmer: we are offered an undefined item!");
        return;
    }
    if(typeof(scriptelement)!=="object"){
        console.warn("snakecharmer: we are offered something else then a object!");
        return;
    }
    if(!scriptelement instanceof HTMLScriptElement){
        console.warn("snakecharmer: this is not a HTMLScriptElement!");
        return;
    }
    if(!["text/x-python"].includes(scriptelement.getAttribute("type"))){
        return;
    }
    
    //
    // ok, this is a scriptelement with our MIME type...
    // lets check if everything is OK
    var classname = scriptelement.getAttribute("snakecharmer-classname");
    if(typeof(classname)!=="string"){
        console.error("snakecharmer: A scripttag with the python type should have an attribute called \"snakecharmer-classname\" in order to know how we should call it",scriptelement);
        return;
    }

    var outputtarget = scriptelement.getAttribute("snakecharmer-outputtarget");
    if(typeof(outputtarget)!=="string"){
        console.error("snakecharmer: A scripttag with the python type should have an attribute called \"snakecharmer-outputtarget\" in order to know where we should display the output",scriptelement);
        return;
    }

    var codeobject = new SnakeCharmerPythonClass(classname,outputtarget,scriptelement.innerHTML);
}

document.addEventListener("DOMContentLoaded",function(){
    console.log("snakecharmer: snakecharmer initialised");
    var available_codes = document.querySelectorAll("script");
    for(var i = 0 ; i < available_codes.length ; i++){
        snakecharmer_inspect_script_element(available_codes[i]);
    }
    console.log("snakecharmer: snakecharmer finished!");
});