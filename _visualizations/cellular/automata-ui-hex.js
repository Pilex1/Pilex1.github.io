{
    let automata = new Automata({"tilingType": "Hexagon"}, parseInt($("#cellQuantityHexagon").val()));
    let ui = new AutomataUI("canvasHexagon", automata);

    // re-updates graphics (i.e. size and colour of cells) by looking at the
    // UI settings
    function updateGraphics() {
        ui.cellColorAlive = $("input[name=colorAliveCellHexagon]").val();
        ui.cellColorDead = $("input[name=colorDeadCellHexagon]").val();
        ui.cellColorStroke = $("input[name=colorOutlineHexagon").val();        
        ui.draw();
    }

    // re-updates rule by looking at the UI
    function updateRule() {
        let keepAlive = [];
        let resurrect = [];

        for (let i = 0; i <= 6; i++) {
            if ($(`#checkAliveHexagon${i}`).is(":checked")) keepAlive.push(i);
            if ($(`#checkResurrectHexagon${i}`).is(":checked")) resurrect.push(i);
        }
     
        automata.rule = new Rule({
            "tilingType": "Hexagon",
            "ruleType": "GameOfLife",
            "neighbourhoodType": "Edge",
            "deadValue": 0,
            "aliveValue": 1,
            "keepAlive": keepAlive,
            "resurrect": resurrect
        });
    }

    for (let i = 0; i <= 6; i++) {
        $("#divKeepAliveHexagon").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkAliveHexagon${i}">
        <label for="checkAliveHexagon${i}" class="form-check-label">${i}</label>
        `);
        $("#divResurrectHexagon").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkResurrectHexagon${i}">
        <label for="checkResurrectHexagon${i}" class="form-check-label">${i}</label>
        `);
        $(`#checkAliveHexagon${i}`).on("click", event => {
            updateRule();
        });
        $(`#checkResurrectHexagon${i}`).on("click", event => {
            updateRule();
        });
    }
    $("#checkAliveHexagon2, #checkAliveHexagon3, #checkResurrectHexagon3").attr("checked", "checked");

    $("#btnIterateHexagon").on("click", event => {
        ui.iterate();
    });
    $("#btnClearHexagon").on("click", event => {
        ui.clear();
    });
    $("#btnRandomizeHexagon").on("click", event => {
        ui.randomize();
    });

    $("input[name=colorAliveCellHexagon]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorDeadCellHexagon]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorOutlineHexagon]").on("input", event=>{
        updateGraphics();
    });

    $("#exportImageHexagon").on("click", event=>{
        

        let svg = ui.scope.project.exportSVG({asString: true});
        let blob = new Blob([svg], {type:     "image/svg+xml;charset=utf-8"});
  
        const blobUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.target = "_blank";
        anchor.download = "image.svg";

        // Auto click on a element, trigger the file download
        anchor.click();

        // This is required
        URL.revokeObjectURL(blobUrl);


    });

    $("#cellSizeHexagon").on("change", event=>{
        ui.cellRadius = parseInt($("#cellSizeHexagon").val());

        ui.drawNew();
        updateGraphics();

    });

    $("#cellQuantityHexagon").on("change", event=>{
        ui.cellQuantity = parseInt($("#cellQuantityHexagon").val());
        automata.updateSize(ui.cellQuantity);

        ui.drawNew();
        updateGraphics();

    });

    $("#btnClearPlusHexagon").on("click", event=>{
        ui.clearInitializeCenter();
    })

    updateRule();
    ui.resizeCanvas();

    ui.cellRadius = parseInt($("#cellSizeHexagon").val());
    ui.cellQuantity = parseInt($("#cellQuantityHexagon").val());

    ui.drawNew();
    updateGraphics();

}