class Entity {
    static get Epsilon() {
        return 0.1;
    }
    static get gravityDy() {
        return 0.8;
    }
    static get AirResistance() {
        return 0.85;
    }
    constructor(hitbox, color) {
        this.hitbox = hitbox;
        this.useGravity = true;
        this.maxNaturalVel = [15, 15];
        this.vel = [0, 0];
        this.acceleration = [1.25, 15];
        this.color = color;
    }
    getDistanceTo(that) {
        return Number(math.distance(this.hitbox.center, that.hitbox.center));
    }
    get velX() {
        return this.vel[0];
    }
    get velY() {
        return this.vel[1];
    }
    set velX(x) {
        this.vel[0] = x;
    }
    set velY(y) {
        this.vel[1] = y;
    }
    onUpdate() { }
    onPlayerTeleport() { }
    calculateFriction() {
        var platforms = this.getPlatformsStandingOn();
        if (platforms.keys.length == 0) {
            return Entity.AirResistance;
        }
        return platforms.keys().next().value.getFriction();
    }
    getPlatformsStandingOn() {
        this.hitbox.incrY(Entity.Epsilon);
        var colliding = manager.getCollidingPlatforms(this);
        this.hitbox.decrY(Entity.Epsilon);
        return colliding;
    }
    inAir() {
        return this.getPlatformsStandingOn().size == 0;
    }
    flyUp() {
        this.vel[1] = -this.maxNaturalVel[1];
    }
    flyDown() {
        this.vel[1] = this.maxNaturalVel[1];
    }
    flyLeft() {
        this.vel[0] = -this.maxNaturalVel[0];
    }
    flyRight() {
        this.vel[0] = this.maxNaturalVel[0];
    }
    jump() {
        if (this.inAir())
            return;
        this.vel[1] -= this.acceleration[1];
        this.vel[1] = math.max(this.vel[1], -this.maxNaturalVel[1]);
    }
    strafeLeft() {
        if (this.vel[0] < -this.maxNaturalVel[0])
            return;
        this.vel[0] -= this.acceleration[0];
        this.vel[0] = math.max(this.vel[0], -this.maxNaturalVel[0]);
    }
    strafeRight() {
        if (this.vel[0] > this.maxNaturalVel[0])
            return;
        this.vel[0] += this.acceleration[0];
        this.vel[0] = math.min(this.vel[0], this.maxNaturalVel[0]);
    }
    moveRightDx(dx) {
        this.hitbox.incrX(dx);
        var collidingNotSolid = manager.getCollidingNotSolidPlatforms(this);
        for (let p of collidingNotSolid) {
            p.onCollisionRight(this);
        }
        var colliding = manager.getCollidingPlatforms(this);
        // find left most platform
        var leftMost = Number.MAX_VALUE;
        for (let p of colliding) {
            leftMost = math.min(leftMost, p.getHitbox().x1);
        }
        if (leftMost != Number.MAX_VALUE) {
            this.hitbox.x2 = leftMost;
        }
        for (let p of colliding) {
            p.onCollisionRight(this);
        }
    }
    moveLeftDx(dx) {
        this.hitbox.decrX(dx);
        var collidingNotSolid = manager.getCollidingNotSolidPlatforms(this);
        for (let p of collidingNotSolid) {
            p.onCollisionLeft(this);
        }
        var colliding = manager.getCollidingPlatforms(this);
        // find right most platform
        var rightMost = Number.MIN_VALUE;
        for (let p of colliding) {
            rightMost = math.max(rightMost, p.getHitbox().x2);
        }
        if (rightMost != Number.MIN_VALUE) {
            this.hitbox.x1 = rightMost;
        }
        for (let p of colliding) {
            p.onCollisionLeft(this);
        }
    }
    jumpDy(dy) {
        this.hitbox.decrY(dy);
        var collidingNotSolid = manager.getCollidingNotSolidPlatforms(this);
        for (let p of collidingNotSolid) {
            p.onCollisionUp(this);
        }
        var colliding = manager.getCollidingPlatforms(this);
        // find bottom most platform
        var bottomMost = Number.MIN_VALUE;
        for (let p of colliding) {
            bottomMost = math.max(bottomMost, p.getHitbox().y2);
        }
        if (bottomMost != Number.MIN_VALUE) {
            this.hitbox.y1 = bottomMost;
        }
        for (let p of colliding) {
            p.onCollisionUp(this);
        }
    }
    fallDy(dy) {
        this.hitbox.incrY(dy);
        var collidingNotSolid = manager.getCollidingNotSolidPlatforms(this);
        for (let p of collidingNotSolid) {
            p.onCollisionDown(this);
        }
        var colliding = manager.getCollidingPlatforms(this);
        // find top most platform
        var topMost = Number.MAX_VALUE;
        for (let p of colliding) {
            topMost = math.min(topMost, p.getHitbox().y1);
        }
        if (topMost != Number.MAX_VALUE) {
            this.hitbox.y2 = topMost;
        }
        for (let p of colliding) {
            p.onCollisionDown(this);
        }
    }
    calcHorizontal() {
        this.vel[0] *= this.calculateFriction();
        var x = this.vel[0];
        if (x > 0) {
            while (x > 0) {
                if (x >= Entity.Epsilon) {
                    this.moveRightDx(Entity.Epsilon);
                }
                else {
                    this.moveRightDx(x);
                }
                x -= Entity.Epsilon;
            }
        }
        else if (x < 0) {
            while (x < 0) {
                if (x <= -Entity.Epsilon) {
                    this.moveLeftDx(Entity.Epsilon);
                }
                else {
                    this.moveLeftDx(-x);
                }
                x += Entity.Epsilon;
            }
        }
    }
    calcVertical() {
        if (this.useGravity) {
            this.vel[1] += Entity.gravityDy;
        }
        this.vel[1] = math.min(this.vel[1], this.maxNaturalVel[1]);
        var y = this.vel[1];
        if (y > 0) {
            while (y > 0) {
                if (y >= Entity.Epsilon) {
                    this.fallDy(Entity.Epsilon);
                }
                else {
                    this.fallDy(Entity.Epsilon);
                    this.moveRightDx(y);
                }
                y -= Entity.Epsilon;
            }
        }
        else if (y < 0) {
            while (y < 0) {
                if (y <= -Entity.Epsilon) {
                    this.jumpDy(Entity.Epsilon);
                }
                else {
                    this.jumpDy(-y);
                }
                y += Entity.Epsilon;
            }
        }
        if (!this.useGravity) {
            this.vel[1] = 0;
        }
    }
    update() {
        this.calcHorizontal();
        this.calcVertical();
        this.onUpdate();
    }
}
