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
          v-on:input="RequiredSymbolsHandler"
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
        height: this.canvasHeight,
        antialias: true,
        transparent: true,
        view: canvas,
      })
      this.app.renderer.backgroundColor = 0xffffff
      this.addCanvasBorder()
      //this.parse()

    },
    RequiredSymbolsHandler(e){
      this.inputSymbols = e.target.value
      //let symbols = e.target.value
      this.symbolsArr = this.inputSymbols.split("");
      let lastItem = this.symbolsArr[this.symbolsArr.length - 1].toUpperCase()
      console.log(lastItem)
      this.prepareToRender(lastItem)
    },
    prepareToRender(lastItem){
      this.arrSymbolsParams.forEach(symbol => {
        if(symbol.symbol===lastItem){
          this.itemsArr.push(symbol)

        }
      })
      console.log(this.itemsArr)
      this.render()
    },
    render(){
      this.itemsArr.forEach(item => {
        console.log("render")
        this.addSymbol(item.x, item.y,0, false)
      })
    },
    addSymbol(x, y, index, border) {
      let texture = this.textures[this.getTextureIndex(x, y)]
      console.log(this.currentX)
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);

      if(border) {
        let spriteBorder = new PIXI.Graphics();
        spriteBorder.lineStyle(1,0xDE3249, 1);
        spriteBorder.drawRect(2, 2, symbolSprite.width-2, symbolSprite.height-2);
        spriteBorder.endFill();

        spriteContainer.addChild(spriteBorder)
      }
      spriteContainer.x = this.currentX
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