<template>
  <div class="w-100">
    <canvas id="pixi"></canvas>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
export default {
  name: 'PIXIRenderer',
  data() {
    return {
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
      y: 0
    }
  },
  props: ['json','charCodeArr','render', 'scale','shiftX',
           'maxWidth', 'image','coordinatesArr','canvasSize',
          'changeXAdvance','letterSpasing','showBorderCheckbox',
          'changeYAdvance','frameW','frameH'],
  mounted() {
    try {
      this.drawPixi()
      this.parse()
    } catch (error) {
      location.reload()

    }


  },
  watch:{
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
    scale: function () {
      this.renderSymbols()
    }
  },
  methods: {
    drawPixi() {
      this.canvasSize.w = 1800;
      this.canvasSize.h = 500;
      let canvas = document.getElementById('pixi')
      this.app = new PIXI.Application({
        width: this.canvasSize.w,
        height: this.canvasSize.h,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0x061639

    },

    parse() {
      let atlas = JSON.parse(this.json)
      let loader = this.app.loader;
      let png = this.image
      loader.add(png).load(() => {
        const sheet = new PIXI.Spritesheet(
            loader.resources[png].texture.baseTexture, atlas
        );
        sheet.parse((...args) => {
          this.textures = Object.values(args[0])
          this.renderSymbols()
        });
      })
    },
    renderSymbols() {
      while(this.app.stage.children[0]) { this.app.stage.removeChild(this.app.stage.children[0]); }
      let spritesheetWrapper = new PIXI.Container()
      let spriteSheetBorder = new PIXI.Graphics();
        spriteSheetBorder.lineStyle(2, 0x000000, 1);
        spriteSheetBorder.drawRect(0, 0, this.canvasSize.w, this.canvasSize.h);
        spriteSheetBorder.endFill();
        spriteSheetBorder.x = 0;
        spriteSheetBorder.y = 0;
        spritesheetWrapper.addChild(spriteSheetBorder)
        this.app.stage.addChild(spritesheetWrapper);
        //letter spasing mode
       if(this.letterSpasing) {
          this.textures.forEach((texture,i) => {
            if(i>1){ return }
            else{
              let container = new PIXI.Container()
              let sprite = PIXI.Sprite.from(texture);
              let spriteBorder = new PIXI.Graphics();
              let line1 = new PIXI.Graphics();
              line1.lineStyle(2, 0x000000)
                  .moveTo(-300, sprite.height)
                  .lineTo(this.canvasSize.w, sprite.height);
              let line2 = new PIXI.Graphics();
              line1.lineStyle(2, 0x000000)
                  .moveTo(-300, sprite.height*2)
                  .lineTo(this.canvasSize.w, sprite.height*2);

              spriteBorder.lineStyle(2, 0xFF3300, 1);
              spriteBorder.drawRect(0, 0, sprite.width, sprite.height);
              spriteBorder.endFill();
              container.addChild(sprite)
              container.position.x = 200+sprite.width*i+Number(this.changeXAdvance*(i+1))
              container.position.y = sprite.height+Number(this.changeYAdvance)
              this.app.stage.addChild(container)
              if(this.showBorderCheckbox) {
                container.addChild(spriteBorder)
                this.app.stage.addChild(line1)
                this.app.stage.addChild(line2)
              }
            }
         })
         }
       //main render mode
      else{
        this.textures.forEach((texture,i) => {
         let sprite = PIXI.Sprite.from(texture);

          let container = new PIXI.Container()
          let spriteBorder = new PIXI.Graphics();
          sprite.width = this.coordinatesArr[i].sourceSize.w
          sprite.height = this.coordinatesArr[i].sourceSize.h
          //sprite.width = this.frameW[0]
          //sprite.height = this.frameH[0]
          spriteBorder.lineStyle(2, 0xFF3300, 1);
          spriteBorder.drawRect(0, 0, sprite.width, sprite.height);
          spriteBorder.endFill();
          spriteBorder.x = sprite.position.x;
          spriteBorder.y = sprite.position.y;
          container.addChild(sprite)
          container.position.x = this.coordinatesArr[i].x * this.scale
          container.position.y = this.coordinatesArr[i].y * this.scale
          spritesheetWrapper.addChild(container)
          if(this.showBorderCheckbox) {
            container.addChild(spriteBorder)
          }
        })
      }


    }
  }
}


</script>