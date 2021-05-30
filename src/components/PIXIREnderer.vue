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
      width: 1800,
      height: 1800,
      backgroundColor: 0xffffff,
      resolution: 1,
      position: 1,
      x: 0,
      y: 0
    }
  },
  props: ['json','charCodeArr','render', 'scale','shiftX','maxWidth', 'image','coordinatesArr','canvasSize'],
  mounted() {
    this.drawPixi()
    this.parse()

  },
  watch:{
    /*render:function () {
      this.parse()
    },*/

    scale: function () {
      this.renderSymbols()
    },
    shiftX: function () {
      this.renderSymbols()
    },
  },
  methods: {
    drawPixi() {
      let canvas = document.getElementById('pixi')
      this.app = new PIXI.Application({
        width: this.width,
        height: this.height,
        antialias: true,
        transparent: true,
        view: canvas,
      })
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
      this.app.stage.addChild(spritesheetWrapper);
      this.textures.forEach((texture,i) => {

        let sprite = PIXI.Sprite.from(texture);
        let container = new PIXI.Container()
        let spriteBorder = new PIXI.Graphics();
      /* let spriteX = this.coordinatesArr[i].x
        let spriteY = this.coordinatesArr[i].y*/
        sprite.width = sprite.texture.orig.width
        sprite.height = sprite.texture.orig.height
        //sprite.position.x = (sprite.width*i+this.shiftX)
        spriteBorder.lineStyle(2, 0xFF3300, 1);
        spriteBorder.drawRect(0, 0, sprite.width, sprite.height);
        spriteBorder.endFill();
        spriteBorder.x = sprite.position.x;
        spriteBorder.y = sprite.position.y;
        container.addChild(spriteBorder)
        container.addChild(sprite)
        container.position.x = this.coordinatesArr[i].x * this.scale
        container.position.y = this.coordinatesArr[i].y * this.scale


        spritesheetWrapper.addChild(container)
        this.sprites.push(sprite)
        /*console.log(`iteration ${i}:
        sprite.width|:${sprite.width}
        container.position.x:${container.position.x}`)*/
      })
    }
  }
}


</script>
