<template>
  <div class="w-100">
    <button  v-if="showRenderButton" class="btn btn-success btn-lg m-3"  v-on:click="drawPixi">Render</button>
    <div class="col-sm-6">
      <canvas id="pixi"></canvas>
    </div>
    <div class="col-sm-6">

    </div>

  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: 'Renderer',
  data() {
    return {
      canvasWidths:500,
      spritesheetWrapper:null,
      spriteSheetBorder:null,
      app:{},
      loader:{},
      sprites:[],
      textures:[],
      rotation: 0,
      //width: 1800,
      //height: 800,
      backgroundColor: 0xFF0000,
      resolution: 1,
      position: 1,
      x: 0,
      y: 0,
      showRenderButton:true
    }
  },
  props: ["canvasHeight", "loadedJSON","loadedPNG","xoffset","showRenderer"],
  computed: {
    shiftX(){
      return this.xoffset
    }
  },
  watch:{
    shiftX: function () {
      if(this.app.stage) {
        this.clearStage()
        this.render()
      }

    },
    showRenderer: function () {

    },
    showBorderCheckbox: function () {
      this.renderSymbols()
    },
    changeXAdvance: function () {
      this.renderSymbols()
    },
    changeYAdvance: function () {
      console.log('change y advance', this.changeYAdvance)
      this.renderSymbols()
    },

    letterSpasing: function () {
      this.renderSymbols()
    },
  },
  methods: {
    drawPixi() {
      console.warn("drawPixi")
      let canvas = document.getElementById('pixi')
      this.app = new PIXI.Application({
        width: this.canvasWidths,
        height: this.canvasHeight,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0x061639
      this.parse()

    },

    parse() {
      console.warn("parse")
      let atlas = JSON.parse(this.loadedJSON)
      let loader = this.app.loader;
      let png = this.loadedPNG
      loader.add(png).load(() => {
        const sheet = new PIXI.Spritesheet(
            loader.resources[png].texture.baseTexture, atlas
        );
        sheet.parse((...args) => {
          this.textures = Object.values(args[0])
          //console.warn(this.textures)
         this.textures.forEach((texture, index) => {
           //console.warn(index, texture.orig.width, texture.orig.height)

          } )
          this.render()
        });
      })
    },
    render() {
      console.log("render")
      this.showRenderButton = false
      this.addCanvasBorder();
      //console.warn(symbolSprite.width,symbolSprite.height)
      this.addSymbol(0,0,5, true)
      this.addSymbol(146+this.shiftX,0,7, true)

        //letter spasing mode
      //  if(this.letterSpasing) {
      //     this.textures.forEach((texture,i) => {
      //       if(i>1){ return }
      //       else{
      //         let container = new PIXI.Container()
      //         let sprite = PIXI.Sprite.from(texture);
      //         let spriteBorder = new PIXI.Graphics();
      //         let line1 = new PIXI.Graphics();
      //         line1.lineStyle(2, 0x000000)
      //             .moveTo(-300, sprite.height)
      //             .lineTo(this.canvasSize.w, sprite.height);
      //         let line2 = new PIXI.Graphics();
      //         line1.lineStyle(2, 0x000000)
      //             .moveTo(-300, sprite.height*2)
      //             .lineTo(this.canvasSize.w, sprite.height*2);
      //
      //         spriteBorder.lineStyle(2, 0xFF3300, 1);
      //         spriteBorder.drawRect(0, 0, sprite.width, sprite.height);
      //         spriteBorder.endFill();
      //         container.addChild(sprite)
      //         container.position.x = 200+sprite.width*i+Number(this.changeXAdvance*(i+1))
      //         container.position.y = sprite.height+Number(this.changeYAdvance)
      //         this.app.stage.addChild(container)
      //         if(this.showBorderCheckbox) {
      //           container.addChild(spriteBorder)
      //           this.app.stage.addChild(line1)
      //           this.app.stage.addChild(line2)
      //         }
      //       }
      //    })
      //    }
      //  //main render mode
      // else{
      //   this.textures.forEach((texture,i) => {
      //    let sprite = PIXI.Sprite.from(texture);
      //
      //     let container = new PIXI.Container()
      //     let spriteBorder = new PIXI.Graphics();
      //     sprite.width = this.coordinatesArr[i].sourceSize.w
      //     sprite.height = this.coordinatesArr[i].sourceSize.h
      //     //sprite.width = this.frameW[0]
      //     //sprite.height = this.frameH[0]
      //     spriteBorder.lineStyle(2, 0xFF3300, 1);
      //     spriteBorder.drawRect(0, 0, sprite.width, sprite.height);
      //     spriteBorder.endFill();
      //     spriteBorder.x = sprite.position.x;
      //     spriteBorder.y = sprite.position.y;
      //     container.addChild(sprite)
      //     container.position.x = this.coordinatesArr[i].x * this.scale
      //     container.position.y = this.coordinatesArr[i].y * this.scale
      //     spritesheetWrapper.addChild(container)
      //     if(this.showBorderCheckbox) {
      //       container.addChild(spriteBorder)
      //     }
      //   })
      // }


    },
    addCanvasBorder() {
      this.spritesheetWrapper = new PIXI.Container()
      this.spriteSheetBorder = new PIXI.Graphics();
      this.spriteSheetBorder.lineStyle(2, 0x000000, 1);
      this.spriteSheetBorder.drawRect(0, 0, this.canvasWidths, this.canvasHeight);
      this.spriteSheetBorder.endFill();
      this.spriteSheetBorder.x = 0;
      this.spriteSheetBorder.y = 0;
      this.spritesheetWrapper.addChild(this.spriteSheetBorder)
      this.app.stage.addChild(this.spritesheetWrapper);
    },
    addSymbol(x, y, index, border) {
      let texture = this.textures[index]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);

      if(border) {
        console.warn(symbolSprite.width,symbolSprite.height)
        let spriteBorder = new PIXI.Graphics();
        spriteBorder.lineStyle(1,0xDE3249, 1);
        spriteBorder.drawRect(2, 2, symbolSprite.width-2, symbolSprite.height-2);
        spriteBorder.endFill();
        spriteContainer.x = x
        spriteContainer.y = y
        spriteContainer.addChild(spriteBorder)
      }
      spriteContainer.addChild(symbolSprite)
      this.spritesheetWrapper.addChild(spriteContainer)


    },
    clearStage() {
      console.log("clearStage")
      console.log(this.app)

      if(this.app && this.app.stage.children.length>0){
        while(this.app.stage.children[0]) {
          this.app.stage.removeChild(this.app.stage.children[0])
        }
      }

    },
  }
}


</script>