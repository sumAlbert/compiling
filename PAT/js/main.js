require.config({
    baseUrl: "js",
    paths: {
        Vue: "./lib/vue.min",
        infoHandler: "./module/infoHandler",
        accidenceAnalysis: "./module/accidenceAnalysis",
    },
    shim: {
        Vue:{
            deps: [],
            exports: "Vue"
        }
    }
});

require(["accidenceAnalysis","Vue","infoHandler"], function(AccidenceAnalysis, Vue, infoHandler){
    new Vue({
        el: "#app",
        data: {
        },
        methods: {
            readFileMain: function(){
                new Promise((resolve,reject) => {//读取文件
                    const file = document.getElementById("file");
                    const fileReader = new FileReader();
                    fileReader.onload = function(){
                        resolve(this.result);
                    };
                    fileReader.onerror = function(){
                        reject();
                    };
                    fileReader.readAsText(file.files[0]);
                }).then(function(result){//词法分析
                    const accidenceAnalysis = new AccidenceAnalysis();
                    const generatorTexts = result.split("\n");
                    let flag = true;
                    generatorTexts.forEach(function(v){
                        if(!accidenceAnalysis.addLine(v).recode){
                            flag = false;
                        }
                    });
                    console.log(accidenceAnalysis);
                    if(flag){
                        return Promise.resolve();
                    }
                    else{
                        return Promise.reject();
                    }
                },function(){
                    infoHandler(0,"读取文件失败");
                }).then(function(){//
                    infoHandler(0,"词法分析成功");
                },function(){
                    infoHandler(0,"词法分析失败");
                }).catch(function(error){
                    infoHandler(0,error);
                });
            },
        }
    });
});