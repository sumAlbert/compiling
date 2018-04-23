define(function(){
    let accidenceAnalysis = function(){
        this.stopSymbols = new Set();
        this.unStopSymbols = new Set();
        this.startSymbol = "";
        this.currentSymbol = "";
        this.spacerSymbol = "|";
        this.generatorsSymbol = "->";
        this.generators = {};
    };

    /**
     * 添加一条产生式
     * @param line
     */
    accidenceAnalysis.prototype.addLine = function(line){
        let treatedLine = this.pretreatment(line);
        console.log(treatedLine);
        let rightPart = "";
        let rightPartItems = [];//产生式右侧的项的集合
        const result = {
            recode: true,
            msg: ""
        };
        if(treatedLine.search(this.generatorsSymbol)!==-1){//存在推导符号的情况
            let treatedLineArr = treatedLine.split(this.generatorsSymbol);
            let leftPart = treatedLineArr[0];//形如："xxxx    "(一定为非终结符号)
            rightPart = treatedLineArr[1];//终结符号和非终结符号的任意组合
            if(/^(\S+)(\s+)$/.test(leftPart)){
                //处理leftPart
                leftPart = leftPart.replace(/\s/g,"");
                if(this.startSymbol.length === 0){//为起始符号
                    this.startSymbol = leftPart;
                }
                this.currentSymbol = leftPart;//设置当前产生式为正在处理的非终结符号
                if(this.generators[this.currentSymbol] === undefined){
                    this.generators[this.currentSymbol] = [];
                }
                if(this.stopSymbols.has(leftPart)){
                    this.stopSymbols.delete(leftPart);
                }
                this.unStopSymbols.add(leftPart);//设置当前符号为非终结符号
            }
            else{
                result.recode = false;
                result.msg = "产生式左侧非终结符号错误";
            }
        }
        else{//不存在推导符号的情况
            if(this.startSymbol.length === 0){
                result.recode = false;
                result.msg = "不存在起始符号";
            }
            else{
                rightPart = treatedLine;
            }
        }

        //处理rightPart
        let rightPartArr = rightPart.split(this.spacerSymbol);
        for(let i = 0;i < rightPartArr.length; i++){
            rightPartArr[i] = rightPartArr[i].replace(/^\s+/,"");
            rightPartArr[i] = rightPartArr[i].replace(/\s+$/,"");
            if(rightPartArr[i].length !== 0){
                rightPartItems.push(rightPartArr[i]);
            }
        }

        //处理rightPartItem
        for(let i = 0;i < rightPartItems.length;i++){
            let rightPartItem = rightPartItems[i];
            this.generators[this.currentSymbol].push(rightPartItem);
            let rightPartItemArr = rightPartItem.split(" ");
            for(let j = 0;j< rightPartItemArr.length;j++){
                let v = rightPartItemArr[j];
                if(v.length !== 0){
                    if(!this.unStopSymbols.has(v)){
                        this.stopSymbols.add(v);
                    }
                }
            }
        }
        return result;
    };
    /**
     * 对输入的产生式中的空格进行预处理
     * @param line 原始产生式
     * @returns {string|XML} 处理后的产生式
     */
    accidenceAnalysis.prototype.pretreatment = function(line){
        let removeFirstBlank = line.replace(/^\s/,"");
        return removeFirstBlank.replace(/\s+/g, " ");
    };
    return accidenceAnalysis;
});