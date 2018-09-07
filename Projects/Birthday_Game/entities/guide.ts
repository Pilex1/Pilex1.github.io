class Guide extends Npc {

    constructor() {
        super([550, Manager.Floor], "Guide", new Color(0xce8eff));
        this.conversations.push("Who are you?");
        this.conversations.push("Who am I?");
        this.conversations.push("What is this place?");
    }
}