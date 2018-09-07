var Action;
(function (Action) {
    Action[Action["Playing"] = 0] = "Playing";
    Action[Action["EditPos"] = 1] = "EditPos";
    Action[Action["EditSize"] = 2] = "EditSize";
    Action[Action["Removing"] = 3] = "Removing";
})(Action || (Action = {}));
var TutorialPlay;
(function (TutorialPlay) {
    TutorialPlay[TutorialPlay["Move"] = 0] = "Move";
    TutorialPlay[TutorialPlay["Talk"] = 1] = "Talk";
    TutorialPlay[TutorialPlay["Done"] = 2] = "Done";
})(TutorialPlay || (TutorialPlay = {}));
var TutorialEdit;
(function (TutorialEdit) {
    TutorialEdit[TutorialEdit["Edit"] = 0] = "Edit";
    TutorialEdit[TutorialEdit["PickBlock"] = 1] = "PickBlock";
    TutorialEdit[TutorialEdit["EditBlock"] = 2] = "EditBlock";
    TutorialEdit[TutorialEdit["Remove"] = 3] = "Remove";
    TutorialEdit[TutorialEdit["RemoveBlock"] = 4] = "RemoveBlock";
    TutorialEdit[TutorialEdit["Teleport"] = 5] = "Teleport";
})(TutorialEdit || (TutorialEdit = {}));
class Player extends Npc {
    constructor() {
        super([150, Manager.Floor], "", new Color(0xFFFFFF));
        this.deaths = 0;
        this.flying = false;
        this.npcRange = 300;
        this.action = Action.Playing;
        this.blocks = [Platform.name, Checkpoint.name, VBounce.name, HBounce.name, Invisible.name, Phantom.name];
        this.editingBlockId = 0;
        this.guidePos = [0, 0];
        this.guide = new GuidePlatform();
        this.guideRemoval = new GuideRemovalPlatform();
        this.tutorialPlay = TutorialPlay.Move;
        this.tutorialEdit = TutorialEdit.Edit;
        this.defaultSpawn = this.hitbox.getPos();
        this.tutorialText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
        this.tutorialText.anchor.x = 0.5;
        this.tutorialText.anchor.y = 0;
        this.tutorialText.position.x = renderer.view.width / 2;
        this.tutorialText.position.y = 20;
        this.tutorialText.style.wordWrap = true;
        this.tutorialText.style.wordWrapWidth = renderer.view.width - 400;
        stage.addChild(this.tutorialText);
        this.debugText = new PIXI.Text("", { fontSize: 18, fontFamily: "Tw Cen MT", fill: "0xffffff" });
        this.debugText.anchor.x = 0;
        this.debugText.anchor.y = 0;
        this.debugText.position.x = 0;
        this.debugText.position.y = 0;
        stage.addChild(this.debugText);
        this.editingBlockText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
        this.editingBlockText.anchor.x = 0.5;
        this.editingBlockText.anchor.y = 1;
        this.editingBlockText.position.x = renderer.view.width / 2;
        this.editingBlockText.position.y = renderer.view.height;
        stage.addChild(this.editingBlockText);
        this.deathText = new PIXI.Text("", { fontSize: 24, fontFamily: "Tw Cen MT", fill: "0xffffff" });
        this.deathText.anchor.x = 1;
        this.deathText.anchor.y = 1;
        this.deathText.position.x = renderer.view.width;
        this.deathText.position.y = renderer.view.height;
        stage.addChild(this.deathText);
    }
    teleportToCheckpoint(checkpoint) {
        this.velX = 0;
        this.velY = 0;
        this.hitbox.x1 = checkpoint.getHitbox().x1;
        this.hitbox.y2 = checkpoint.getHitbox().y2;
        for (var e of manager.getAllEntities()) {
            e.onPlayerTeleport();
        }
    }
    isEditing() {
        if (!edit)
            return false;
        return this.action === Action.EditPos || this.action === Action.EditSize;
    }
    isRemoving() {
        if (!edit)
            return false;
        return this.action === Action.Removing;
    }
    setAction(action) {
        if (this.isEditing()) {
            this.guide.getHitbox().setSize([50, 50]);
        }
        this.action = action;
    }
    get cameraPos() {
        return [this.hitbox.centerX - renderer.view.width / 2, this.hitbox.centerY - renderer.view.height / 2];
    }
    checkRespawn() {
        if (this.hitbox.centerY >= Manager.Floor + 2000) {
            var c = manager.getActiveCheckpoint();
            if (c === null) {
                this.hitbox.setPos(this.defaultSpawn);
            }
            else {
                this.hitbox.x1 = c.getHitbox().x1;
                this.hitbox.y2 = c.getHitbox().y2;
            }
            this.velX = 0;
            this.velY = 0;
            manager.resetBlocks();
            this.deaths += 1;
        }
    }
    getMousePos() {
        var mx = mouseX + this.hitbox.centerX - renderer.view.width / 2;
        var my = mouseY + this.hitbox.centerY - renderer.view.height / 2;
        return [mx, my];
    }
    getSelectedPlatform() {
        var platforms = manager.getActivePlatforms();
        var selected = null;
        for (var p of platforms) {
            var mousePos = this.getMousePos();
            if (p.getHitbox().inside(mousePos)) {
                selected = p;
                break;
            }
        }
        return selected;
    }
    onMouseClick(e) {
        if (this.action === Action.EditPos) {
            this.action = Action.EditSize;
            if (this.blocks[this.editingBlockId] === Checkpoint.name) {
                var pos = this.guide.getHitbox().getPos();
                var y = pos[1] + 50 - (Checkpoint.StickHeight + Checkpoint.FlagHeight - Checkpoint.Offset);
                var x = pos[0];
                manager.addPlatform(new Checkpoint([x, y]));
                this.setAction(Action.EditPos);
                if (this.tutorialEdit === TutorialEdit.EditBlock) {
                    this.tutorialEdit++;
                }
            }
        }
        else if (this.action === Action.EditSize) {
            var rect = this.guide.getHitbox().regularise();
            for (var i = 0; i < rect.width / 50; i++) {
                for (var j = 0; j < rect.height / 50; j++) {
                    var pos = rect.getPos();
                    pos[0] += i * 50;
                    pos[1] += j * 50;
                    if (this.blocks[this.editingBlockId] === Platform.name) {
                        manager.addPlatform(new Platform(pos));
                    }
                    else if (this.blocks[this.editingBlockId] === VBounce.name) {
                        manager.addPlatform(new VBounce(pos));
                    }
                    else if (this.blocks[this.editingBlockId] === HBounce.name) {
                        manager.addPlatform(new HBounce(pos));
                    }
                    else if (this.blocks[this.editingBlockId] === Invisible.name) {
                        manager.addPlatform(new Invisible(pos));
                    }
                    else if (this.blocks[this.editingBlockId] === Phantom.name) {
                        manager.addPlatform(new Phantom(pos));
                    }
                    if (this.tutorialEdit === TutorialEdit.EditBlock) {
                        this.tutorialEdit++;
                    }
                }
            }
            this.setAction(Action.EditPos);
        }
    }
    onKeyType(e) {
        if (e.code === "Enter") {
            var npc = manager.getClosestNpc(this);
            if (npc !== null) {
                if (npc.getDistanceTo(this) <= this.npcRange) {
                    npc.talk();
                    if (this.tutorialPlay === TutorialPlay.Talk) {
                        this.tutorialPlay += 1;
                    }
                }
            }
        }
        if (edit) {
            if (e.code === "KeyE") {
                this.setAction(Action.EditPos);
                if (this.tutorialEdit === TutorialEdit.Edit) {
                    this.tutorialEdit += 1;
                }
            }
            if (e.code === "KeyJ") {
                this.previousBlock();
                if (this.tutorialEdit === TutorialEdit.PickBlock) {
                    this.tutorialEdit += 1;
                }
            }
            if (e.code === "KeyL") {
                this.nextBlock();
                if (this.tutorialEdit === TutorialEdit.PickBlock) {
                    this.tutorialEdit += 1;
                }
            }
            if (e.code === "KeyR") {
                this.setAction(Action.Removing);
                if (this.tutorialEdit === TutorialEdit.Remove) {
                    this.tutorialEdit += 1;
                }
            }
            if (e.code === "KeyU") {
                var c = manager.getPreviousCheckpoint(this);
                if (c !== null) {
                    this.teleportToCheckpoint(c);
                    if (this.tutorialEdit === TutorialEdit.Teleport) {
                        this.tutorialEdit += 1;
                    }
                }
            }
            if (e.code === "KeyO") {
                var c = manager.getNextCheckpoint(this);
                if (c !== null) {
                    this.teleportToCheckpoint(c);
                    if (this.tutorialEdit === TutorialEdit.Teleport) {
                        this.tutorialEdit += 1;
                    }
                }
            }
        }
    }
    onMouseScroll(e) {
        if (e.deltaY < 0) {
            this.previousBlock();
        }
        else if (e.deltaY > 0) {
            this.nextBlock();
        }
    }
    nextBlock() {
        this.editingBlockId++;
        if (this.editingBlockId >= this.blocks.length - 1) {
            this.editingBlockId = 0;
        }
    }
    previousBlock() {
        this.editingBlockId--;
        if (this.editingBlockId < 0) {
            this.editingBlockId = this.blocks.length - 1;
        }
    }
    handleInputs() {
        if (keys["Escape"]) {
            this.setAction(Action.Playing);
        }
        this.useGravity = edit ? !this.flying : true;
        if (keys["KeyW"]) {
            if (this.tutorialPlay === TutorialPlay.Move) {
                this.tutorialPlay += 1;
            }
            if (this.useGravity) {
                this.jump();
            }
            else {
                this.flyUp();
            }
        }
        if (keys["KeyS"]) {
            if (this.tutorialPlay === TutorialPlay.Move) {
                this.tutorialPlay += 1;
            }
            if (this.useGravity) {
            }
            else {
                this.flyDown();
            }
        }
        if (keys["KeyA"]) {
            if (this.tutorialPlay === TutorialPlay.Move) {
                this.tutorialPlay += 1;
            }
            if (this.useGravity) {
                this.strafeLeft();
            }
            else {
                this.flyLeft();
            }
        }
        if (keys["KeyD"]) {
            if (this.tutorialPlay === TutorialPlay.Move) {
                this.tutorialPlay += 1;
            }
            if (this.useGravity) {
                this.strafeRight();
            }
            else {
                this.flyRight();
            }
        }
    }
    vectorToString(p) {
        return "[" + (math.round(p[0] * 100) / 100).toFixed(2) + ", " + (math.round(p[1] * 100) / 100).toFixed(2) + "]";
    }
    renderDebug() {
        if (edit) {
            var str = "";
            str += "Pos: " + this.vectorToString(this.hitbox.center) + "\n";
            str += "Mouse Pos: " + this.vectorToString(this.getMousePos()) + "\n";
            str += "Vel: " + this.vectorToString(this.vel) + "\n";
            if (this.isEditing()) {
                str += "Edit Pos: " + this.vectorToString(this.guide.getHitbox().getPos()) + "\n";
                str += "Edit Size: " + this.vectorToString(this.guide.getHitbox().getSize()) + "\n";
            }
            else if (this.isRemoving()) {
                str += "Removal Pos: " + this.vectorToString(this.guideRemoval.getHitbox().getPos()) + "\n";
                str += "Removal Size: " + this.vectorToString(this.guideRemoval.getHitbox().getSize()) + "\n";
            }
            this.debugText.text = str;
        }
        else {
            this.debugText.text = "";
        }
    }
    leaveAllTalking() {
        for (var npc of manager.getAllNpcs()) {
            npc.leaveTalking();
        }
    }
    handleNpcs() {
        var npc = manager.getClosestNpc(this);
        if (npc !== null && npc.getDistanceTo(this) > this.npcRange) {
            this.leaveAllTalking();
        }
    }
    // returns top left
    blockify(v, s) {
        return [math.sign(v[0]) * math.floor(math.abs(v[0]) / s) * s, math.sign(v[1]) * math.floor(math.abs(v[1]) / s) * s];
    }
    blockifyCeil(v, s) {
        var x = 0;
        if (v[0] < 0) {
            x = math.min(-s, math.floor(v[0] / s) * s);
        }
        else {
            x = math.max(s, math.ceil(v[0] / s) * s);
        }
        var y = 0;
        if (v[1] < 0) {
            y = math.min(-s, math.floor(v[1] / s) * s);
        }
        else {
            y = math.max(s, math.ceil(v[1] / s) * s);
        }
        return [x, y];
    }
    handleEditing() {
        if (this.isEditing()) {
            this.editingBlockText.text = this.blocks[this.editingBlockId];
            var mousePos = this.getMousePos();
            if (this.action === Action.EditPos) {
                // top left
                this.guidePos = this.blockify(mousePos, 10);
                this.guide.getHitbox().setPos(this.guidePos);
                this.guide.getHitbox().setSize([50, 50]);
            }
            else if (this.action == Action.EditSize) {
                var offset = math.subtract(mousePos, this.guidePos);
                if (offset[0] <= 0) {
                    // mouse to left of guide
                    this.guide.getHitbox().x1 = this.guidePos[0] + 50;
                }
                else {
                    this.guide.getHitbox().x1 = this.guidePos[0];
                }
                if (offset[1] <= 0) {
                    // mouse above guide
                    this.guide.getHitbox().y1 = this.guidePos[1] + 50;
                }
                else {
                    this.guide.getHitbox().y1 = this.guidePos[1];
                }
                var newOffset = math.subtract(mousePos, this.guidePos);
                if (offset[0] <= 0) {
                    newOffset[0] -= 50;
                }
                if (offset[1] <= 0) {
                    newOffset[1] -= 50;
                }
                this.guide.getHitbox().setSize(this.blockifyCeil(newOffset, 50));
            }
        }
        else {
            this.editingBlockText.text = "";
            this.guide.getHitbox().setSize([0, 0]);
        }
    }
    handleRemoving() {
        if (this.isRemoving()) {
            var p = this.getSelectedPlatform();
            if (p !== null) {
                this.guideRemoval.getHitbox().setPos(p.getHitbox().getPos());
                this.guideRemoval.getHitbox().setSize(p.getHitbox().getSize());
                if (mouseButtons[0]) {
                    manager.removePlatform(p);
                    if (this.tutorialEdit === TutorialEdit.RemoveBlock) {
                        this.tutorialEdit++;
                    }
                }
            }
            else {
                this.guideRemoval.getHitbox().setSize([0, 0]);
            }
        }
        else {
            this.guideRemoval.getHitbox().setSize([0, 0]);
        }
    }
    renderTutorial() {
        if (this.tutorialPlay === TutorialPlay.Move) {
            this.tutorialText.text = "Press W, A, S, D to move around.";
        }
        else if (this.tutorialPlay === TutorialPlay.Talk) {
            this.tutorialText.text = "Press Enter near an NPC to talk.";
        }
        else if (edit) {
            if (this.tutorialEdit === TutorialEdit.Edit) {
                this.tutorialText.text = "Press E to enter edit mode.";
            }
            else if (this.tutorialEdit === TutorialEdit.PickBlock) {
                this.tutorialText.text = "Press J or L, or use the mouse wheel, select a block.";
            }
            else if (this.tutorialEdit === TutorialEdit.EditBlock) {
                this.tutorialText.text = "Left click once to select the starting corner, and left click a second time to set the ending corner. This will place down the blocks.";
            }
            else if (this.tutorialEdit === TutorialEdit.Remove) {
                this.tutorialText.text = "Press R to enter remove mode.";
            }
            else if (this.tutorialEdit === TutorialEdit.RemoveBlock) {
                this.tutorialText.text = "Left click whilst hovering over a block to remove it.";
            }
            else if (this.tutorialEdit === TutorialEdit.Teleport) {
                this.tutorialText.text = "Press U or O to teleport to the closest checkpoint to the left or to the right respectively.";
            }
            else {
                this.tutorialText.text = "";
            }
        }
        else {
            this.tutorialText.text = "";
        }
    }
    onUpdate() {
        this.handleInputs();
        this.handleNpcs();
        this.checkRespawn();
        this.handleEditing();
        this.handleRemoving();
        this.renderDebug();
        this.renderTutorial();
    }
    onRender(camera) {
        super.onRender(camera);
        if (this.isEditing()) {
            this.guide.onRender(camera);
        }
        else if (this.isRemoving()) {
            this.guideRemoval.onRender(camera);
        }
        this.deathText.text = "Deaths: " + this.deaths;
    }
}
