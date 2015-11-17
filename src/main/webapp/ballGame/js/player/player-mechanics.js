Clarity.prototype.draw_player = function (context) {
    
	var image_x=this.player.loc.x - this.camera.x;
	var image_y=this.player.loc.y - this.camera.y;
	try{
    if(!this.key.up && this.player.on_floor && this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y){
    	if(this.key.right){
    		if(this.player.foot.time>=20){
    			if(!this.player.foot.change){
    				this.player.foot.change=true;
    			}else{
    				this.player.foot.change=false;
    			}
    			drawSprite("mario_walk_right.png", image_x, image_y,this.tile_size);
				this.player.foot.time=1;
			}else{
				this.player.foot.time=this.player.foot.time+1;
				if(!this.player.foot.change){
					drawSprite("mario_walk_right_foot.png", image_x, image_y,this.tile_size);
    			}else{
    				drawSprite("mario_walk_right.png", image_x, image_y,this.tile_size);
    			}
			}
    	}else if(this.key.left){
    		if(this.player.foot.time>=20){
    			if(!this.player.foot.change){
    				this.player.foot.change=true;
    			}else{
    				this.player.foot.change=false;
    			}
    			drawSprite("mario_walk_left.png", image_x, image_y,this.tile_size);
				this.player.foot.time=1;
			}else{
				this.player.foot.time=this.player.foot.time+1;
				if(!this.player.foot.change){
					drawSprite("mario_walk_left_foot.png", image_x, image_y,this.tile_size);
    			}else{
    				drawSprite("mario_walk_left.png", image_x, image_y,this.tile_size);
    			}
			}
    	}else{
    		drawSprite("marioParado.png", image_x, image_y,this.tile_size);
    	}
    }else{
    	if(this.key.right){
    		drawSprite("jump-right.png", image_x, image_y,this.tile_size);
    	}else if(this.key.left){
    		drawSprite("jump-left.png", image_x, image_y,this.tile_size);
    	}else{
    		drawSprite("jump-right.png", image_x, image_y,this.tile_size);
    	}
    }
	}catch (e) {
        if (e.name == "NS_ERROR_NOT_AVAILABLE") {

        }
    }
    //context.fill();
    //context.stroke();
};
Clarity.prototype.update_player = function () {

    if (this.key.left) {

        if (this.player.vel.x > -this.current_map.vel_limit.x)
            this.player.vel.x -= this.current_map.movement_speed.left;
    }

    if (this.key.up) {

        if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y) {
            
            this.player.vel.y -= this.current_map.movement_speed.jump;
            this.player.can_jump = false;
        }
    }

    if (this.key.right) {

        if (this.player.vel.x < this.current_map.vel_limit.x)
            this.player.vel.x += this.current_map.movement_speed.left;
    }
    
    this.move_player();
};
Clarity.prototype.move_player = function () {
	currentMap=this.current_map;
	tilesize=this.tile_size;
    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;

    var offset = Math.round((this.tile_size / 2) - 1);

    var tile = this.get_tile(
        Math.round(this.player.loc.x / this.tile_size),
        Math.round(this.player.loc.y / this.tile_size)
    );
     
    if(tile.gravity) {
    	if (this.key.down){
    		this.player.vel.y += (tile.gravity.y * 6);
    	}else{
    		
    		this.player.vel.y += tile.gravity.y;
    	}
    	this.player.vel.x += tile.gravity.x;
    } else {
        
        this.player.vel.x += this.current_map.gravity.x;
        this.player.vel.y += this.current_map.gravity.y;
    }
    
    if (tile.friction) {

        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }

    var t_y_up   = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1  = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2  = Math.round((this.player.loc.y + offset) / this.tile_size);

    var t_x_left  = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1   = Math.round((this.player.loc.x - offset) / this.tile_size);
    var x_near2   = Math.round((this.player.loc.x + offset) / this.tile_size);

    var top1    = this.get_tile(x_near1, t_y_up);
    var top2    = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1   = this.get_tile(t_x_left, y_near1);
    var left2   = this.get_tile(t_x_left, y_near2);
    var right1  = this.get_tile(t_x_right, y_near1);
    var right2  = this.get_tile(t_x_right, y_near2);


    if (tile.jump && this.jump_switch > 15) {

        this.player.can_jump = true;
        
        this.jump_switch = 0;
        
    } else this.jump_switch++;
    
    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);
    
    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;
    
    this.player.vel.x *= .9;
    
    if (left1.solid || left2.solid || right1.solid || right2.solid) {

        /* fix overlap */

        while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x += 0.1;

        while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
            || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x -= 0.1;

        /* tile bounce */

        var bounce = 0;

        if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
        if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
        if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
        if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;

        this.player.vel.x *= -bounce || 0;
        
    }
    
    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

        /* fix overlap */
        
        while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y += 0.1;

        while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
            || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y -= 0.1;

        /* tile bounce */
        
        var bounce = 0;
        
        if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
        if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;
        
        this.player.vel.y *= -bounce || 0;

        if ((bottom1.solid || bottom2.solid) && !tile.jump) {
            
            this.player.on_floor = true;
            this.player.can_jump = true;
        }
        
    }
    
    // adjust camera

    var c_x = Math.round(this.player.loc.x - this.viewport.x/2);
    var c_y = Math.round(this.player.loc.y - this.viewport.y/2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);
    
    if(x_dif > 5) {
        
        var mag = Math.round(Math.max(1, x_dif * 0.1));
    
        if(c_x != this.camera.x) {
            
            this.camera.x += c_x > this.camera.x ? mag : -mag;
            
            if(this.limit_viewport) {
                
                this.camera.x = 
                    Math.min(
                        this.current_map.width_p - this.viewport.x + this.tile_size,
                        this.camera.x
                    );
                
                this.camera.x = 
                    Math.max(
                        0,
                        this.camera.x
                    );
                camerax=this.camera.x;
            }
        }
    }
    
    if(y_dif > 5) {
        
        var mag = Math.round(Math.max(1, y_dif * 0.1));
        
        if(c_y != this.camera.y) {
            
            this.camera.y += c_y > this.camera.y ? mag : -mag;
        
            if(this.limit_viewport) {
                
                this.camera.y = 
                    Math.min(
                        this.current_map.height_p - this.viewport.y + this.tile_size,
                        this.camera.y
                    );
                
                this.camera.y = 
                    Math.max(
                        0,
                        this.camera.y
                    );
                cameray=this.camera.y;
            }
        }
    }
    
    if(this.last_tile != tile.id && tile.script && (tile.creature== undefined || tile.creature.existente==0 )) {
    	eval(this.current_map.scripts[tile.script]);
    }
    
    this.last_tile = tile.id;
};