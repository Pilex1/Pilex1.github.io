function setActive(title, description) {
    $("header>h1").html(title);
    console.log($("header>h1"));
    $(".main-nav>ul>li>a:contains('"+title+"')").attr("class", "header_current_heading");
    $("header>p").html(description);
}