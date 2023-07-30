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

class SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable{

    constructor(){}

    calculate(masterclass,line){
        throw new Error("Not supported yet");
    }

}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault extends SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable{

    constructor(item){
        super();
        this.item = item;
    }

    calculate(masterclass,line){
        return masterclass.getVariable(this.item);
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonString extends SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable{

    constructor(item){
        super();
        this.item = item;
    }

    calculate(masterclass,line){
        return String(this.item);
    }

}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode extends SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable{

    constructor(item){
        super();
        this.item = item;
    }

    isMathematicOperator(){
        return ["+", "=", "/", "*", "-", "<", ">", "+=", "-=", "/=", "*=", ">=", "<="].includes(this.item);
    }

    isAssignOperator(){
        return ["=", "+=", "-=", "/=", "*="].includes(this.item);
    }

    isMathOperationOperator(){
        return ["+", "/", "*", "-", "<", ">", "<=", ">="].includes(this.item);
    }

    isBooleanOperationOperator(){
        return ["<=", ">=", ">", "<"].includes(this.item);
    }

    isFunctionParameterOperator(){
        return ["(", ",", ")"].includes(this.item);
    }

    isComma(){
        return [","].includes(this.item);
    }

    handleCommand(left,right,masterclass){
        if(this.isAssignOperator()){
            left = left.calculate(masterclass,null);
            if(left==null){
                return right;
            }
            if(this.item=="="){
                return right;
            }else if(this.item=="+="){
                return left + right;
            }else if(this.item=="-="){
                return left - right;
            }else if(this.item=="/="){
                return left / right;
            }else if(this.item=="*="){
                return left * right;
            }else{
                throw new Error("Unknown operator");
            }
        }else if(this.isBooleanOperationOperator()){
            if(!(typeof(left)==="number")){
                left = left.calculate(masterclass,null);
            }
            if(!(typeof(right)==="number")){
                right = right.calculate(masterclass,null);
            }
            if(this.item=="<="){
                return left <= right;
            }else if(this.item==">="){
                return left >= right;
            }else if(this.item=="<"){
                return left < right;
            }else if(this.item==">"){
                return left > right;
            }else{
                throw new Error("Unknown operator");
            }
        }else{
            throw new Error("Not implemented yet");
        }
    }

    calculate(masterclass,line){
        throw new Error("Opcode cannot be calculated");
    }
}

class SnakeCharmerConsoleClassSourceLineTokenAbstractCommonNumber extends SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable{

    constructor(item){
        super();
        this.item = item;
    }

    calculate(masterclass,line){
        return Number(this.item);
    }
}

class SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(){
        this.underlyingblocks = [];
    }

    expectUnderlyingBlocks(){
        return false;
    }

    execute(line,masterclass){
        throw new Error("execute not supperted yet for this function");
    }
}

class SnakeCharmerConsoleClassSourceLineCommandMathematical{

    constructor(parameters){
        this.parameters = parameters;
    }

    calculate(line,masterclass){
        var result = null;
        if(this.parameters.length>0){
            if(!(this.parameters[0] instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable)){
                masterclass.reportError(line,"Needs to be a calculatable");
            }
            result = this.parameters[0].calculate(masterclass,line);
            for(var i = 1 ; i < this.parameters.length ; i+=2){
                if(!(this.parameters[i] instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode)){
                    masterclass.reportError(line,"Parameter "+(i+1)+" needs to be a opcode");
                }
                result = this.parameters[i].handleCommand(result,this.parameters[i+1],masterclass);
            }
        }
        return result;
    }
}

class SnakeCharmerConsoleClassSourceLineCommandAssignation extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(variable,operator,newvalue){
        super();
        this.variable = variable;
        this.operator = operator;
        this.newvalue = newvalue;
    }

    execute(line,masterclass){
        if(!(this.variable instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault)){
            masterclass.reportError(line,"Variable expected here!");
        }
        if(!(this.operator instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode)){
            masterclass.reportError(line,"Opcode expected here!");
        }
        if(!((this.newvalue instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCalculatable)||(this.newvalue instanceof SnakeCharmerConsoleClassSourceLineCommandCallable))){
            masterclass.reportError(line,"Calculatable expected here!");
        }
        var newtocreatevalue = this.newvalue.calculate(masterclass,line);
        var calculatedvalue = this.operator.handleCommand(this.variable,newtocreatevalue,masterclass);
        masterclass.setVariable(this.variable.item,calculatedvalue);
    }
}

class SnakeCharmerConsoleClassSourceLineCommandCallable extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(functionname,parameters){
        super();
        this.functionname = functionname;
        this.parameters = parameters;
    }

    calculate(masterclass,line){
        if(!(this.functionname instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault)){
            masterclass.reportError(line,"Functionname expected here!");
        }
        var func = window.navigator.pythonInterpeter.bridge[this.functionname.item];
        if(typeof(func)!=="function"){
            masterclass.reportError(line,"No such function: "+this.functionname.item);
        }
        var params = [];
        params.push(masterclass);
        for(var i = 0 ; i < this.parameters.length ; i++){
            var thisone = this.parameters[i];
            params.push(thisone.calculate(masterclass,line));
        }
        return func(params);
    }

    execute(line,masterclass){
        return this.calculate(masterclass,line);
    }
}

class SnakeCharmerConsoleClassSourceLineCommandWhile extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(statement){
        super();
        this.statement = statement;
    }

    expectUnderlyingBlocks(){
        return true;
    }

    executeStatement(line,masterclass){
        if(this.statement instanceof SnakeCharmerConsoleClassSourceLineCommandMathematical){
            return this.statement.calculate(line,masterclass)>0;
        }
        return false;
    }

    execute(line,masterclass){
        while(this.executeStatement(line,masterclass)){
            line.executeUnderlyingBlocks(masterclass);
        }
    }
}

class SnakeCharmerConsoleClassSourceLineCommandIf extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(statement){
        super();
        this.statement = statement;
    }

    expectUnderlyingBlocks(){
        return true;
    }

    executeStatement(line,masterclass){
        if(this.statement instanceof SnakeCharmerConsoleClassSourceLineCommandMathematical){
            return this.statement.calculate(line,masterclass)>0;
        }
        return false;
    }

    execute(line,masterclass){
        if(this.executeStatement(line,masterclass)){
            line.executeUnderlyingBlocks(masterclass);
        }
    }

}

class SnakeCharmerConsoleClassSourceLineCommandRaise extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(callable){
        super();
        this.callable = callable;
    }

    execute(line,masterclass){
        throw this.callable.execute(line,masterclass);
    }
}

class SnakeCharmerConsoleClassSourceLineCommandFor extends SnakeCharmerConsoleClassSourceLineExecutable{

    constructor(item,itemarray){
        super();
        this.item = item;
        this.itemarray = itemarray;
    }

    expectUnderlyingBlocks(){
        return true;
    }
}

class SnakeCharmerPythonClassSourceLine{

    constructor(rawline,linenumber){

        // get all the basic info
        this.rawline = rawline;
        this.linenumer = linenumber;
        this.executable = null;
        this.rawtokenslist = [];
        this.tabs = 0;

        // start turning it into tokens
        // rawdata
        var rawtokens = rawline.split("");
        this.rawitem = "";
        var firstone = true;
        for(var i = 0 ; i < rawtokens.length ; i++){
            var thisone = rawtokens[i];
            if(thisone==" "&&firstone){
                this.tabs++;
            }else{
                firstone = false;
                if([" ","\"","(",")","<",">",":","+","=","/","*","-","[","]",",","\'"].includes(thisone)){
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

        // detect tokens
        var temparray = [];
        var instring = false;
        var stringstring = "";
        var instring2 = false;
        var stringstring2 = "";
        for(var i = 0 ; i < this.rawtokenslist.length ; i++){
            var thisone = this.rawtokenslist[i];
            if(thisone=="\""){
                if(instring){
                    instring = false;
                }else{
                    instring = true;
                }
                if(instring==false){
                    temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonString(stringstring));
                    stringstring = "";
                }
            }else if(instring){
                stringstring += thisone;
            }else if(thisone=="\'"){
                if(instring2){
                    instring2 = false;
                }else{
                    instring2 = true;
                }
                if(instring2==false){
                    temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonString(stringstring2));
                    stringstring2 = "";
                }
            }else if(instring2){
                stringstring2 += thisone;
            }else if(thisone==" "){
                // ignore whitespace
            }else if([ "(", ")", "<", ">", ":", "+", "=", "/", "*", "-", "[", "]","," ,'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'].includes(thisone)){
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

        // combine token which can be together
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode&&thisone.isMathematicOperator()){
                var thisone2 = this.rawtokenslist.pop();
                if(thisone2 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode&&thisone2.isMathematicOperator()){
                    temparray.push(new SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode(thisone.item+""+thisone2.item));
                }else{
                    this.rawtokenslist.push(thisone2);
                    temparray.push(thisone);
                }
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect math operations
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault || thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonNumber){
                if(this.rawtokenslist.length==0){
                    temparray.push(thisone);
                }else{
                    var itemarray = [];
                    var thisone2 = this.rawtokenslist.pop();
                    if((thisone2 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode)&&thisone2.isMathOperationOperator()){
                        itemarray.push(thisone);
                        itemarray.push(thisone2);
                        var thisone3 = this.rawtokenslist.pop();
                        if(thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault || thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonNumber){
                            itemarray.push(thisone3);
                        }else{
                            throw new Error("Error: expected: default or number",thisone,thisone2,thisone3);
                        }
                        temparray.push(new SnakeCharmerConsoleClassSourceLineCommandMathematical(itemarray));
                    }else{
                        this.rawtokenslist.push(thisone2);
                        temparray.push(thisone);
                    }
                }
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect function calls
        var requiresaonceagaincall = true;
        while(requiresaonceagaincall){
            requiresaonceagaincall = false;
            temparray = [];
            this.rawtokenslist.reverse();
            while(true){
                if(this.rawtokenslist.length==0){
                    break;
                }
                var thisone = this.rawtokenslist.pop();
                if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault){
                    if(this.rawtokenslist.length==0){
                        temparray.push(thisone);
                    }else{
                        var thisone2 = this.rawtokenslist.pop();
                        if((thisone2 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode)&&thisone2.isFunctionParameterOperator()&&thisone2.item=="("){
                            var parameterlist = [];
                            var again = true;
                            while(again){
                                var thisone3 = this.rawtokenslist.pop();
                                if(typeof thisone3 === "undefined"){
                                    again = false;
                                }else{
                                    if(thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode){
                                        if(thisone3.item==")"){
                                            again = false;
                                        }else if(thisone3.item=="("){
                                            // there is a call inside us!!!
                                            temparray.push(thisone);
                                            temparray.push(thisone2);
                                            for(var i = 0 ; i < (parameterlist.length-1) ; i++){
                                                temparray.push(parameterlist[i]);
                                            }
                                            thisone = parameterlist[parameterlist.length-1];
                                            parameterlist = [];
                                        }
                                    }else{
                                        parameterlist.push(thisone3);
                                    }
                                }
                            }
                            temparray.push(new SnakeCharmerConsoleClassSourceLineCommandCallable(thisone,parameterlist));
                            requiresaonceagaincall = true;
                        }else{
                            this.rawtokenslist.push(thisone2);
                            temparray.push(thisone);
                        }
                    }
                }else{
                    temparray.push(thisone);
                }
            }
            this.rawtokenslist = temparray;
        }

        // detect assignations
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonDefault){
                if(this.rawtokenslist.length==0){
                    temparray.push(thisone);
                }else{
                    var thisone2 = this.rawtokenslist.pop();
                    if((thisone2 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode)&&thisone2.isAssignOperator()){
                        var thisone3 = this.rawtokenslist.pop();
                        temparray.push(new SnakeCharmerConsoleClassSourceLineCommandAssignation(thisone,thisone2,thisone3));
                    }else{
                        this.rawtokenslist.push(thisone2);
                        temparray.push(thisone);
                    }
                }
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect while
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone.item == "while"){
                var thisone2 = this.rawtokenslist.pop();
                var thisone3 = this.rawtokenslist.pop();
                if(!(thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone3.item == ":")){
                    throw new Error("Expected: : after while [statement] ",this);
                }
                temparray.push(new SnakeCharmerConsoleClassSourceLineCommandWhile(thisone2));
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect if
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone.item == "if"){
                var thisone2 = this.rawtokenslist.pop();
                var thisone3 = this.rawtokenslist.pop();
                if(!(thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone3.item == ":")){
                    throw new Error("Expected: : after if [statement] ",this);
                }
                temparray.push(new SnakeCharmerConsoleClassSourceLineCommandIf(thisone2));
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect raise
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone.item == "raise"){
                var thisone2 = this.rawtokenslist.pop();
                temparray.push(new SnakeCharmerConsoleClassSourceLineCommandRaise(thisone2));
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        // detect for
        temparray = [];
        this.rawtokenslist.reverse();
        while(true){
            if(this.rawtokenslist.length==0){
                break;
            }
            var thisone = this.rawtokenslist.pop();
            if(thisone instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone.item == "for"){
                var thisone2 = this.rawtokenslist.pop();
                var thisone3 = this.rawtokenslist.pop();
                if(!(thisone3 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone3.item == "in")){
                    throw new Error("Expected: in after for [statement] ",this);
                }
                var thisone4 = this.rawtokenslist.pop();
                var thisone5 = this.rawtokenslist.pop();
                if(!(thisone5 instanceof SnakeCharmerConsoleClassSourceLineTokenAbstractCommonOpcode && thisone5.item == ":")){
                    throw new Error("Expected: : after for [statement] in [statement] ",this);
                }
                temparray.push(new SnakeCharmerConsoleClassSourceLineCommandFor(thisone2,thisone3));
            }else{
                temparray.push(thisone);
            }
        }
        this.rawtokenslist = temparray;

        if(this.rawtokenslist.length!=1){
            console.error(this);
            throw new Error("Expected: one executable item, found: ",this);
        }

        if(!this.rawtokenslist[0] instanceof SnakeCharmerConsoleClassSourceLineExecutable){
            console.error(this);
            throw new Error("Item is not an executable",this);
        }

        this.executable = this.rawtokenslist[0];

        delete this.rawtokenslist;
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

    expectUnderlyingBlocks(){
        return this.executable.expectUnderlyingBlocks();
    }

    executeUnderlyingBlocks(masterclass){
        if(!this.expectUnderlyingBlocks()){
            masterclass.reportError(this,"There are no underlying blocks alltrough you try to execute them...");
        }
        for(var i = 0 ; i < this.executable.underlyingblocks.length ; i++){
            var thisone = this.executable.underlyingblocks[i];
            thisone.execute(masterclass);
        }
    }

    execute(masterclass){
        if(window.navigator.pythonInterpeter.debug){
            console.log(this);
        }
        if(this.executable instanceof SnakeCharmerConsoleClassSourceLineExecutable){
            this.executable.execute(this,masterclass);
        }else{
            masterclass.reportError(this,"Object cannot be executed");
        }
        return true;
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
            var item = new SnakeCharmerPythonClassSourceLine(rawcodelinestrings[i],i+1);
            if(item.executable==null){
                continue;
            }
            rawcodelist.push(item);
        }

        // attach things under eachother....
        this.code = [];
        var lastone = null;
        var tablist = [rawcodelist[0].tabs];
        for(var i = 0 ; i < rawcodelist.length ; i++){
            var thisone = rawcodelist[i];
            if(lastone==null && thisone.expectUnderlyingBlocks()){
                this.code.push(thisone);
                lastone = thisone;
                lastone.parent = this.code;
            }else if(lastone==null){
                this.code.push(thisone);
            }else if(thisone.expectUnderlyingBlocks()){
                lastone.executable.underlyingblocks.push(thisone);
                lastone.parent = thisone;
                lastone = thisone;
            }else if(lastone.executable.underlyingblocks.length>0&&tablist[tablist.length-1]!=thisone.tabs){
                if(Array.isArray(lastone.parent)){
                    lastone = null;
                    this.code.push(thisone);
                }else{
                    lastone = lastone.parent;
                    lastone.executable.underlyingblocks.push(thisone);
                }
            }else{
                if(lastone.executable.underlyingblocks.length==0){
                    tablist.push(thisone.tabs);
                }
                lastone.executable.underlyingblocks.push(thisone);
            }
        }

        this.variablelist = {};
        this.scopepointer = [];
        
    }

    enterScope(scopename){
        this.scopepointer.push(scopename);
        this.variablelist[scopename] = {};
    }

    leaveScope(){
        this.scopepointer.pop();
    }

    getVariable(varname){
        for(var a = this.scopepointer.length-1 ; a > -1 ; a--){
            var scope = this.scopepointer[a];
            var bridge = this.variablelist[scope];
            if(typeof(bridge[varname])!=="undefined"){
                return bridge[varname];
            }
        }
        return null;
    }

    setVariable(varname,varvalue){
        for(var a = this.scopepointer.length-1 ; a > -1 ; a--){
            var scope = this.scopepointer[a];
            this.variablelist[scope][varname] = varvalue;
        }
    }

    reportError(lineobject,message){
        throw new Error("An error occured.\n\nSourcefile:\t"+this.name+"\nLine:\t\t"+lineobject.toString()+"\nMessage:\t"+message);
    }

    print(message){
        this.printer.print(message);
    }

    runCodeWithoutFunction(){
        if(window.navigator.pythonInterpeter.debug){
            console.log("snakecharmers: " + this.name + ": now running runCodeWithoutFunction");
        }
        this.enterScope("_");
        for(var i = 0 ; i < this.code.length ; i++){
            var thisone = this.code[i];
            thisone.execute(this);
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
    window.navigator.pythonInterpeter.stack.push(codeobject);
}

window.navigator.pythonInterpeter = {};
window.navigator.pythonInterpeter.version = 0.1;
window.navigator.pythonInterpeter.vendor = "Sanderslando";
window.navigator.pythonInterpeter.debug = true;
window.navigator.pythonInterpeter.initialised = false;
window.navigator.pythonInterpeter.stack = [];
window.navigator.pythonInterpeter.bridge = {};
window.navigator.pythonInterpeter.bridge.print = function(args){
    args[0].print(args[1]);
};
window.navigator.pythonInterpeter.bridge.int = function(args){
    return Number(args[1]);
};
window.navigator.pythonInterpeter.bridge.input = function(args){
    return window.prompt(args[1]);
};
window.navigator.pythonInterpeter.bridge.ValueError = function(args){
    return args[1];
};
document.addEventListener("DOMContentLoaded",function(){
    if(window.navigator.pythonInterpeter.debug){
        console.log("snakecharmer: snakecharmer initialised");
    }
    var available_codes = document.querySelectorAll("script");
    for(var i = 0 ; i < available_codes.length ; i++){
        snakecharmer_inspect_script_element(available_codes[i]);
    }
    window.navigator.pythonInterpeter.initialised = true;
    if(window.navigator.pythonInterpeter.debug){
        console.log("snakecharmer: snakecharmer finished!");
    }
    for(var i = 0 ; i < window.navigator.pythonInterpeter.stack.length ; i++){
        var deze = window.navigator.pythonInterpeter.stack[i];
        deze.runCodeWithoutFunction();
    }
});