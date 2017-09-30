class Npc extends Entity {

	protected name: string;
	protected conversations: string[] = [];
	private conversationId: number = -1;

	private conversationText: PIXI.Text;
	private nameText: PIXI.Text;

	constructor(pos: number[], name: string, color: Color) {
		super(new Rectangle(pos, [20, 40]), color);
		this.name = name;
		this.conversationText = new PIXI.Text("");
		this.nameText = new PIXI.Text(this.name);
		stage.addChild(this.conversationText);
		stage.addChild(this.nameText);
	}

	isTalking(): boolean {
		return this.conversationId != -1;
	}

	leaveTalking(): void {
		this.conversationId = -1;
	}

	talk(): void {
		this.conversationId += 1;
		if (this.conversationId >= this.conversations.length) {
			this.conversationId = -1;
		}
	}

	onRender(camera): void {
		graphics.beginFill(this.color.value, this.color.alpha);
		graphics.lineStyle(0);
		graphics.drawRect(this.hitbox.x1 - camera[0], this.hitbox.y1 - camera[1], this.hitbox.width, this.hitbox.height);

		if (this.conversationId === -1) {
			this.conversationText.text = "";
		} else {
			this.conversationText.text = this.conversations[this.conversationId];
		}
		if (this.isTalking()) {
			var w = 350, h = 120, margin = 10, x = 0, y = 0;
			var pos = manager.getPlayer().hitbox.center;
			if (pos[0] <= this.hitbox.x1) {
				x = this.hitbox.centerX - camera[0] - 20 - w;
			} else {
				x = this.hitbox.centerX - camera[0] + 20;
			}
			y = this.hitbox.y1 - camera[1] - 20 - h;

			graphics.beginFill(0xffffff, 0.5);
			graphics.lineStyle(1, 0x000000, 0.5);
			graphics.drawRoundedRect(x, y, w, h, 5);
			if (pos[0] <= this.hitbox.x1) {
				graphics.drawCircle(x + w, y + h + 10, 10);
			} else {
				graphics.drawCircle(x, y + h + 10, 10);
			}

			// conversation
			this.conversationText.style.fontSize = 24;
			this.conversationText.style.fontFamily = "Tw Cen MT";
			this.conversationText.style.fill = "0x444444";
			this.conversationText.style.align = "center";
			this.conversationText.style.wordWrap = true;
			this.conversationText.style.wordWrapWidth = w - 2 * margin;
			this.conversationText.anchor.x = 0.5;
			this.conversationText.anchor.y = 0.5;
			this.conversationText.x = x + margin + (w - 2 * margin) / 2;
			this.conversationText.y = y + margin + (h - 2 * margin) / 2;

			// npc name
			this.nameText.style.fontSize = 24;
			this.nameText.style.fontFamily = "Tw Cen MT";
			this.nameText.style.fill = "0xffffff";
			this.nameText.style.align = "left";
			this.nameText.anchor.x = 0;
			this.nameText.anchor.y = 1;
			this.nameText.x = x;
			this.nameText.y = y;
		} else {
			// npc name
			this.nameText.style.fontSize = 24;
			this.nameText.style.fontFamily = "Tw Cen MT";
			this.nameText.style.fill = "0xffffff";
			this.nameText.style.align = "center";
			this.nameText.anchor.x = 0.5;
			this.nameText.anchor.y = 1;
			this.nameText.x = this.hitbox.centerX - camera[0];
			this.nameText.y = this.hitbox.y1 - camera[1] - 10;
		}
	}

}