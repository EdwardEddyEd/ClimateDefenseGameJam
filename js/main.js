(function() {
    // Canvas variables, two of which are global for accessibility and ease
    CANVAS_WIDTH = 1920.0;
    CANVAS_HEIGHT = CANVAS_WIDTH * (9.0/16.0);
    var ratio = CANVAS_HEIGHT / CANVAS_WIDTH;

    // Autodetect, create and append the renderer to the body element
    var rendererOptions = {
        antialias: true,
        transparent: false,
        resolution: window.devicePixelRatio,
        autoResize: true,
    }
    
    // Create the canvas in which the game will show, and a
    // generic container for all the graphical objects
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
     
    // Put the renderer on screen in the center
    renderer.view.style.position = "absolute";
    renderer.view.style.left = "50%";
    renderer.view.style.top = "50%";
    renderer.view.style.transform = "translate3d( -50%, -50%, 0 )";
    renderer.backgroundColor = 0x7744ff;
     
    // The stage is essentially a display list of all game objects
    // for Pixi to render; it's used in resize(), so it must exist
    stage = new PIXI.Container();
     
    // Resize the renderer to fill the screen
    resize();
     
    // Actually place the renderer onto the page for display
    document.body.appendChild(renderer.view);

    // // Give id to canvas
    $("canvas").attr('id', 'mainCanvas'); 
    
    // Listen for and adapt to changes to the screen size, e.g.,
    // user changing the window or rotating their device
    window.addEventListener("resize", resize);

    // Load up textures
    textureManager = new TextureManager();
    textureManager.loadTextureFromImage("overworldMap", "res/board.png");
    loadSpriteSheet1();
    loadSprites1();

    gameManager = new GameManager();
    // gameManager.addGameState(new TitleState());
    gameManager.addGameState(new MainGameState());

    //displayAllSprites(textureManager.textures);

    // Add a keyListener to select buttons
    // document.addEventListener("keydown", onKeyDown);
    // document.addEventListener("keyup", onKeyUp);

    // A global variable that keeps track of various variables, such as messages, timing, and reward. This is meant for professors to change parts of the experiment they see fit.
    //configVariables = new configVariables();

    animate();
 
    function animate() {

        gameManager.tick();

        // Render the stage
        renderer.render(stage);
        requestAnimationFrame(animate);
    }

    // function onKeyDown(key){
    //     if (!j_key_down && (key.keyCode === 70 || key.keyCode === 102)) {
    //         f_key_down = true;
    //     }
    //     if (!f_key_down && (key.keyCode === 74 || key.keyCode === 106)) {
    //         j_key_down = true;
    //     }
    // }

    // function onKeyUp(key){
    //     if(f_key_down && (key.keyCode === 74 || key.keyCode === 106))
    //         return;
    //     if(j_key_down && (key.keyCode === 70 || key.keyCode === 102))
    //         return;

    //     f_key_down = false;
    //     j_key_down = false;
    // }

    function loadSpriteSheet1(){
        let baseTexture = PIXI.BaseTexture.fromImage("res/spritesheet1.png");

        let row = 0;
        let col = 0;
        let width = 32;
        let height = 32;

        let textureNames = ["windTower_Idle", "windTower_Active1", "windTower_Active2", "hydroTower_Idle", "hydroTower_Active1", "hydroTower_Active2",
                            "hydroTower_Proj_Vert", "hydroTower_Proj_Horiz", "hydroTower_Proj_Diag1", "hydroTower_Proj_Diag2", "hydroTower_Proj_Break1", "hydroTower_Proj_Break2",
                            "enemyAnthrax_Move1", "enemyAnthrax_Move2", "enemyAnthrax_Death1", "enemyAnthrax_Death2", "enemyAnthrax_Death3", "enemyCO2_Death1",
                            "enemyCO2_Move1", "enemyCO2_Move2", "enemyCO2_Death2", "enemyCO2_Death3", "windTower_Proj_90", "windTower_Proj_Horiz",
                            "windTower_Proj_45", "windTower_Proj_315", "windTower_Proj_270", "windTower_Proj_225", "windTower_Proj_180", "windTower_Proj_135",
                            "windTower_Proj_Break1", "windTower_Proj_Break2"];

        for(row = 0; row < 5; row++){
            for(col = 0; col < 6; col++){
                let frame = new PIXI.Texture(baseTexture, new PIXI.Rectangle(width * col, height * row, width, height));
                textureManager.loadTexture(textureNames[row * 6 + col], frame);

            }
        }

        col = 0;
        let frame = new PIXI.Texture(baseTexture, new PIXI.Rectangle(width * col, height * row, width, height));
        textureManager.loadTexture(textureNames[row * 6 + col], frame);
        col++;

        frame = new PIXI.Texture(baseTexture, new PIXI.Rectangle(width * col, height * row, width, height));
        textureManager.loadTexture(textureNames[row * 6 + col], frame);

    }

    function loadSprites1(){
        let basePath = "res/";
        let texturePaths = ["Buy.png", "buy_highlight.png", "buy_screen_asset.png", "double_fusion.png", "single_fusion.png", 
                            "grid_power_range_3.png", "turbine_range_6.png", "windmill_damage_2.png", "left_arrow.png",
                            "left_arrow_highlight.png", "right_arrow.png", "right_arrow_highlight.png"];
        let textureNames = ["buy", "buy_highlight", "buy_screen_asset", "double_fusion", "single_fusion", 
                            "grid_power_range_3", "turbine_range_6", "windmill_damage_2", "left_arrow",
                            "left_arrow_highlight", "right_arrow", "right_arrow_highlight"];

        for(let i = 0; i < texturePaths.length; i++){
            let texture = new PIXI.Texture.fromImage(basePath + texturePaths[i]);
            textureManager.loadTexture(textureNames[i], texture);
        }
    }

    function displayAllSprites(textures){
        let x = 32;
        let y = 32;
        let skip = 1;
        for (var key in textures) {
            if(skip > 0){
                skip--;
                continue;
            }

            if (textures.hasOwnProperty(key)) {
                let sprite = new PIXI.Sprite(textures[key]);
                sprite.x = x;
                sprite.y = y;
                stage.addChild(sprite);
                x += 32;
            }
        }
    }

    function resize() {
        // Determine which screen dimension is most constrained
        ratio = Math.min(window.innerWidth/CANVAS_WIDTH, window.innerHeight/CANVAS_HEIGHT);

        // Scale the view appropriately to fill that dimension
        stage.scale.x = stage.scale.y = ratio;

        // Update the renderer dimensions
        renderer.resize(Math.ceil(CANVAS_WIDTH * ratio), Math.ceil(CANVAS_HEIGHT * ratio));
    }
})();