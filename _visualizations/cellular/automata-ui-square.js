{
    let automata = new Automata({ "tilingType": "Square" }, parseInt($("#cellQuantitySquare").val()));
    let ui = new AutomataUI("canvasSquare", automata);

    // re-updates graphics (i.e. colour of cells) by looking at the
    // UI settings
    function updateGraphics() {
        ui.cellColorAlive = $("input[name=colorAliveCellSquare]").val();
        ui.cellColorDead = $("input[name=colorDeadCellSquare]").val();
        ui.cellColorStroke = $("input[name=colorOutlineSquare").val();        
        ui.draw();
    }

    // re-updates rule by looking at the UI
    function updateRule() {
        let keepAlive = [];
        let resurrect = [];

        const neighbourhoodType = $("input[name=neighbourhoodSquare]:checked").val();
        if (neighbourhoodType === "Edge") {
            $("#divKeepAliveMooreSquare, #divResurrectMooreSquare").hide();
            $("#divKeepAliveNeumannSquare, #divResurrectNeumannSquare").show();

            for (let i = 0; i <= 4; i++) {
                if ($(`#checkAliveNeumannSquare${i}`).is(":checked")) keepAlive.push(i);
                if ($(`#checkResurrectNeumannSquare${i}`).is(":checked")) resurrect.push(i);
            }
        } else if (neighbourhoodType === "Point") {
            $("#divKeepAliveMooreSquare, #divResurrectMooreSquare").show();
            $("#divKeepAliveNeumannSquare, #divResurrectNeumannSquare").hide();

            for (let i = 0; i <= 8; i++) {
                if ($(`#checkAliveMooreSquare${i}`).is(":checked")) keepAlive.push(i);
                if ($(`#checkResurrectMooreSquare${i}`).is(":checked")) resurrect.push(i);
            }
        }
        automata.rule = new Rule({
            "tilingType": "Square",
            "ruleType": "GameOfLife",
            "neighbourhoodType": neighbourhoodType,
            "deadValue": 0,
            "aliveValue": 1,
            "keepAlive": keepAlive,
            "resurrect": resurrect
        });
    }

    for (let i = 0; i <= 4; i++) {
        $("#divKeepAliveNeumannSquare").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkAliveNeumannSquare${i}">
        <label for="checkAliveNeumannSquare${i}" class="form-check-label">${i}</label>
        `);
        $("#divResurrectNeumannSquare").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkResurrectNeumannSquare${i}">
        <label for="checkResurrectNeumannSquare${i}" class="form-check-label">${i}</label>
        `);
        $(`#checkAliveNeumannSquare${i}`).on("click", event => {
            updateRule();
        });
        $(`#checkResurrectNeumannSquare${i}`).on("click", event => {
            updateRule();
        });
    }
    $("#checkAliveNeumannSquare2, #checkAliveNeumannSquare3, #checkResurrectNeumannSquare3").attr("checked", "checked");

    for (let i = 0; i <= 8; i++) {
        $("#divKeepAliveMooreSquare").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkAliveMooreSquare${i}">
        <label for="checkAliveMooreSquare${i}" class="form-check-label">${i}</label>
        `);
        $("#divResurrectMooreSquare").append(`
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="checkResurrectMooreSquare${i}">
        <label for="checkResurrectMooreSquare${i}" class="form-check-label">${i}</label>
        `);
        $(`#checkAliveMooreSquare${i}`).on("click", event => {
            updateRule();
        });
        $(`#checkResurrectMooreSquare${i}`).on("click", event => {
            updateRule();
        });
    }
    $("#checkAliveMooreSquare2, #checkAliveMooreSquare3, #checkResurrectMooreSquare3").attr("checked", "checked");

    $("#btnIterateSquare").on("click", event => {
        ui.iterate();
    });
    $("#btnClearSquare").on("click", event => {
        ui.clear();
    });
    $("#btnRandomizeSquare").on("click", event => {
        ui.randomize();
    });

    $("input[name=neighbourhoodSquare]").on("change", function (event) {
        updateRule();
    });

    $("input[name=colorAliveCellSquare]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorDeadCellSquare]").on("input", event=>{
        updateGraphics();
    });
    $("input[name=colorOutlineSquare]").on("input", event=>{
        updateGraphics();
    });

    $("#exportImageSquare").on("click", event=>{

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

    $("#cellSizeSquare").on("change", event=>{
        ui.cellRadius = parseInt($("#cellSizeSquare").val());

        ui.drawNew();
        updateGraphics();

    });

    $("#cellQuantitySquare").on("change", event=>{
        ui.cellQuantity = parseInt($("#cellQuantitySquare").val());
        automata.updateSize(ui.cellQuantity);

        ui.drawNew();
        updateGraphics();

    });

    $("#btnClearPlusSquare").on("click", event=>{
        ui.clearInitializeCenter();
    })

    updateRule();
    ui.resizeCanvas();

    ui.cellRadius = parseInt($("#cellSizeSquare").val());
    ui.cellQuantity = parseInt($("#cellQuantitySquare").val());

    ui.drawNew();
    updateGraphics();

}