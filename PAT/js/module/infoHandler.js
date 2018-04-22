define([],function(){
   return function(type,msg){
       switch(type){
           case 0: {
               console.log(msg);
               break;
           }
           default:
               break;
       }
   };
});