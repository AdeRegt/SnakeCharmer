// Snakecharmer 
// Created by Alexandros de Regt since 2023-07-21

/**
 * Output Save Format
 */
class SnakeCharmerTape{

    /**
     * Creates a new Output Save Item
     * @param {Date} date 
     * @param {String} message 
     */
    constructor(date,message){
        this.date = date;
        this.message = message;
    }

    toString(){
        return JSON.stringify(this);
    }
}

/**
 * Lowest version of a printable
 */
class SnakeCharmerPrinter{

    /**
     * Creates the default endpoint printer
     */
    constructor(){
        this.printedMessages = [];
    }

    /**
     * Get all printed messages for this class
     * @returns returned messages in array
     */
    getPrintedMessages(){
        return this.printedMessages;
    }

    /**
     * Push a new message to the screen
     * @param {String} message 
     */
    print(message){
        var newmessage = null;
        if(typeof(message)!=="string"){
            var message2 = message.toString();
            if(message2==="[object Object]"){
                newmessage = JSON.stringify(message);
            }else{
                newmessage = message2;
            }
        }else{
            newmessage = message;
        }
        this.printedMessages.push(new SnakeCharmerTape(new Date(),newmessage));
    }

}

class SnakeCharmerHTMLPrinter extends SnakeCharmerPrinter{

    /**
     * HTMLPrinterPointer constructor
     * @param {String} objectname 
     */
    constructor(objectname){
        super();
        this.objectname = objectname;
        this.objects = document.querySelectorAll(objectname);
        if(this.objects.length==0){
            throw new Error("Invalid querySelector for SnakeCharmerHTMLPrinter");
        }
    }

    print(message){
        super.print(message);
        for(var i = 0 ; i < this.objects.length ; i++){
            this.objects[i].innerHTML += message;
        }
    }


}

class SnakeCharmerConsolePrinter extends SnakeCharmerPrinter{

    /**
     * HTMLPrinterPointer constructor
     */
    constructor(){
        super();
    }

    print(message){
        super.print(message);
        console.log("snakecharmer: "+message);
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault{

    constructor(item){
        this.item = item;
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonString{

    constructor(item){
        this.item = item;
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode{

    constructor(item){
        this.item = item;
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonNumber{

    constructor(item){
        this.item = item;
    }
}

class SnakeCharmerConsoleClassSourceLineCommandStatement{

    constructor(item1,opcode,item2){
        this.item1 = item1;
        this.opcode = opcode;
        this.item2 = item2;
    }
}

class SnakeCharmerPythonClassSourceLine{

    constructor(rawline,linenumber){
        this.rawline = rawline;
        this.linenumer = linenumber;
        this.tokens = [];
        this.rawtokenslist = [];
        this.tabs = 0;

        var rawtokens = rawline.split("");
        this.rawitem = "";
        var firstone = true;
        for(var i = 0 ; i < rawtokens.length ; i++){
            var thisone = rawtokens[i];
            if(thisone==" "&&firstone){
                this.tabs++;
            }else{
                firstone = false;
                if([" ","\"","(",")","<",">",":","+","=","/","*","-","[","]"].includes(thisone)){
                    this.addRawToken();
                    this.rawitem = thisone;
                    this.addRawToken();
                }else{
                    this.rawitem += thisone;
                }
            }
        }
        this.addRawToken();
        delete this.rawitem;

        var temparray = [];
        var instring = false;
        var stringstring = "";
        for(var i = 0 ; i < this.rawtokenslist.length ; i++){
            var thisone = this.rawtokenslist[i];
            if(thisone=="\""){
                instring != instring;
                if(instring==false){
                    temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonString(stringstring));
                    stringstring = "";
                }
            }else if(instring){
                stringstring += thisone;
            }else if(thisone==" "){

            }else if([ "(", ")", "<", ">", ":", "+", "=", "/", "*", "-", "[", "]" ,'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'].includes(thisone)){
                temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode(thisone));
            }else if(!isNaN(thisone)){
                temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonNumber(thisone));
            }else{
                temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault(thisone));
            }
        }
        this.rawtokenslist = temparray;
        if(this.rawtokenslist.length==0){
            return;
        }
        temparray = [];
        for(var i = 0 ; i < this.rawtokenslist.length ; i++){
            var thisitem = this.rawtokenslist[i];
        }

        console.log(this);
    }

    addRawToken(){
        if(this.rawitem.length==0){
            return;
        }
        this.rawtokenslist.push(this.rawitem);
        this.rawitem = "";
    }

    toString(){
        return this.linenumer + ": " + this.rawline;
    }
}

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

        if(this.target=="stdio"){
            this.printer = new SnakeCharmerConsolePrinter();
        }else{
            this.printer = new SnakeCharmerHTMLPrinter(this.target);
        }

        var rawcodelinestrings = this.rawcode.split("\n");
        var rawcodelist = [];
        for(var i = 0 ; i < rawcodelinestrings.length ; i++){
            rawcodelist.push(new SnakeCharmerPythonClassSourceLine(rawcodelinestrings[i],i+1));
        }
        
    }

    reportError(lineobject,message){
        throw new Error("An error occured.\n\nSourcefile:"+this.name+"\nLine:"+lineobject.toString()+"\nMessage:"+message);
    }

    print(message){
        this.printer.print(message);
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