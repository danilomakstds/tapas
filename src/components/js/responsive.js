window.onresize = function() {
    onMobile();
}

window.onload = function(){
    onMobile();
}

function onMobile(){
    if(window.outerWidth < 1200){
        //if Mobile
        $(".newscard").removeClass("w-33").addClass("w-100");
        $(".mobile-title").removeClass("d-none").addClass("d-block");
        $(".slider-header").removeClass("d-block").addClass("d-none");
        
    }else{
        //if Desktop
        $(".newscard").addClass("w-33").removeClass("w-100");
        $(".mobile-title").addClass("d-none").removeClass("d-block");
        $(".slider-header").addClass("d-block").removeClass("d-none");
    }
}
