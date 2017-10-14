function setActive(title, description) {
    $("header>h1").html(title);
    $(".main-nav>ul>li>a:contains('"+title+"')").attr("class", "header_current_heading");
    $("header>p").html(description);
}