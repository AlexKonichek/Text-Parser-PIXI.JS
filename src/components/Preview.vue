<template>
<div>
  <button class="btn btn-success btn-lg m-3"  v-on:click="drawPixi">Preview</button>
  <canvas id="pixiPreview"></canvas>
  <div>
    <label class="text-white h4 mt-2"  for="symbols"></label>
    <div class="input-group input-group-lg mb-2">
      <input
          type="text"
          id="symbols"
          class="form-control mr-3"
          v-model="inputSymbols"
          v-on:change="onInputHandler"
          required
          placeholder="USD"
      >
    </div>
  </div>

</div>
</template>

<script>
import * as PIXI from "pixi.js";

export default {
  name: "Preview",
  data() {
    return {
      app:{},
      canvasBackground: 0xffffff,
      canvasWidths:500,
      canvasHeight:200,
      inputSymbols:"",
      symbolsArr:[],
      texturesForRender:[],
      itemsArr:[],
      spritesheetWrapper:null,
      currentX:0

    }
  },
  props:["arrSymbolsParams", "textures"],
  methods: {
    drawPixi() {
      console.warn("drawPixi")
      let canvas = document.getElementById('pixiPreview')
      this.app = new PIXI.Application({
        width: this.canvasWidths,
        height: this.textures[0].frame.height+10,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0xffffff
      this.addCanvasBorder()

    },
    onInputHandler(e){
      this.inputSymbols = e.target.value
      //let symbols = e.target.value
      this.symbolsArr = this.inputSymbols.split("");
      //let lastItem = this.symbolsArr[this.symbolsArr.length - 1].toUpperCase()
      console.log("onInputHandler",this.symbolsArr)

      this.symbolsArr.forEach(symbol => this.prepareToRender(symbol.toUpperCase()))
    },
    prepareToRender(lastItem){
      console.warn("prepareToRender")
      this.arrSymbolsParams.forEach(symbol => {
        if(symbol.symbol === lastItem){
          this.itemsArr.push(symbol)
        }
        else return
      })
      if(this.itemsArr.length === this.symbolsArr.length ) {
        console.log(this.itemsArr.length, this.symbolsArr.length)
        this.render()
      }

      //this.render()
    },
    render(){
      console.warn("render")
      this.itemsArr.forEach(item => {
        this.addSymbol(item.x, item.y, item.xoffset,0, false)
      })
    },
    addSymbol(x, y, xoffset, index, border) {
      let texture = this.textures[this.getTextureIndex(x, y)]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);

      if(border) {
        let spriteBorder = new PIXI.Graphics();
        spriteBorder.lineStyle(1,0xDE3249, 1);
        spriteBorder.drawRect(2, 2, symbolSprite.width-2, symbolSprite.height-2);
        spriteBorder.endFill();

        spriteContainer.addChild(spriteBorder)
      }
      spriteContainer.x = this.currentX + xoffset
      spriteContainer.y = 0
      spriteContainer.addChild(symbolSprite)
      this.spritesheetWrapper.addChild(spriteContainer)
      this.currentX += texture.orig.width


    },
    getTextureIndex(x,y) {
      let index = this.textures.findIndex(texture => texture.frame.x === x && texture.frame.y === y );
      return index
    },
    addCanvasBorder() {
       this.spritesheetWrapper = new PIXI.Container()
      let spriteSheetBorder = new PIXI.Graphics();
      spriteSheetBorder.lineStyle(2, 0x000000, 1);
      spriteSheetBorder.drawRect(0, 0, this.canvasWidths, this.canvasHeight);
      spriteSheetBorder.endFill();
      spriteSheetBorder.x = 0;
      spriteSheetBorder.y = 0;
      this.spritesheetWrapper.addChild(spriteSheetBorder)
      this.app.stage.addChild(this.spritesheetWrapper);
    },

  }
}

</script>

<style scoped>

</style>